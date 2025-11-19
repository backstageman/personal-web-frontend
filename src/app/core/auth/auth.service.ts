import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './models/user.model';
import { LOCK_KEYS } from './service-lock-keys.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/authentication`;

  private accessToken: string | null = null; // 存内存，不存 localStorage
  // BehaviorSubjects 用于状态流
  public auth$ = new BehaviorSubject<boolean>(false); // 登录状态 observable
  public userSubject = new BehaviorSubject<User | null>(null); // 用户信息 observable
  // 对外暴露只读流
  public user$ = this.userSubject.asObservable();

  private isRefreshing = false;
  public refresh$?: Observable<any>; // 缓存 refresh 请求

  // “是否已经检查过登录状态”(即认证初始化是否完成)
  private authChecked = new BehaviorSubject<boolean>(false);
  authChecked$ = this.authChecked.asObservable();

  // 🔒 全局请求锁
  private requestLock = new Map<string, any>();

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_INFO_KEY = 'user_info';

  constructor(private http: HttpClient) {
    this.initializeDevAuthFromStorage();
  }

  private initializeDevAuthFromStorage() {
    if (environment.enableDevMode) {
      const storedToken = localStorage.getItem(this.TOKEN_KEY);
      const storedUser = localStorage.getItem(this.USER_INFO_KEY);
      if (storedToken) {
        this.accessToken = storedToken;
        this.userSubject.next(storedUser ? JSON.parse(storedUser) : this.userSubject.value);
        this.authChecked.next(true);
      }
    }
  }

  /** 设置内存中的 access token */
  setAccessToken(token: string | null) {
    this.accessToken = token;
    // this.auth$.next(!!token);
  }

  /** 获取当前 access token */
  getAccessToken() {
    return this.accessToken;
  }

  // 通用锁检测器
  private withLock<T>(key: string, action: () => Observable<T>): Observable<T> {
    if (this.requestLock.has(key)) {
      // console.warn(`⚠️ Request "${key}" is already in progress.`);
      return this.requestLock.get(key);
    }

    const obs$ = action().pipe(
      finalize(() => {
        this.requestLock.delete(key);
      }),
      shareReplay(1)
    );

    this.requestLock.set(key, obs$);
    return obs$;
  }

  login(email: string, password: string): Observable<any> {
    return this.withLock(LOCK_KEYS.LOGIN, () =>
      this.http
        .post(
          `${this.API}/sign-in`,
          {
            email,
            password,
          },
          { withCredentials: true }
        )
        .pipe(
          tap((res: any) => {
            this.setAccessToken(res.accessToken);
            this.userSubject.next(res.user || { userId: res.userId });
            if (environment.enableDevMode && res.accessToken) {
              localStorage.setItem(this.TOKEN_KEY, res.accessToken);
              const info = res.user || { userId: res.userId };
              localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(info));
            }
            this.authChecked.next(true);
            // console.log('✅ login success:', res);
            // return res;
          }),
          catchError((err) => {
            // console.error('❌ login failed:', err);
            this.clearSession();
            return of(null);
          })
        )
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.withLock(LOCK_KEYS.REGISTER, () => {
      return this.http
        .post(
          `${this.API}/sign-up`,
          {
            email,
            password,
          },
          { withCredentials: true }
        )
        .pipe(
          tap((res: any) => {
            // console.log('✅ register success:', res);
          }),
          catchError((err) => {
            // console.error('❌ register failed:', err);
            return of(null);
          })
        );
    });
  }

  refresh(): Observable<any> {
    // console.log('[refresh] called');

    // if (!this.accessToken) return of();

    /* // 如果已有正在进行的 refresh 请求，直接复用它
    if (this.refresh$) {
      // console.log('[refresh] returning existing refresh$');
      this.authChecked.next(true);
      return this.refresh$;
    } */
    if (this.isRefreshing) return this.refresh$ || of(null);
    this.isRefreshing = true;

    // 重要：立即赋值给 this.refresh$，以避免并发时多个请求被发出
    this.refresh$ = this.http
      .post(`${this.API}/refresh-tokens`, {}, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          this.setAccessToken(res.accessToken);
          // 如果后端返回完整 user 对象，优先用它，否则退回到 userId
          this.userSubject.next(
            res?.user || (res?.userId ? { userId: res.userId } : null)
          );
          if (environment.enableDevMode && res?.accessToken) {
            localStorage.setItem(this.TOKEN_KEY, res.accessToken);
            const info = res?.user || (res?.userId ? { userId: res.userId } : null);
            if (info) localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(info));
          }
          // console.log('refresh res >>>', res);
        }),
        catchError((err) => {
          // console.log('refresh -> error', err);
          // 在 refresh 失败时，清理登录状态（可选：不立刻调用 logout，视你的业务）
          // this.logOut();
          this.clearSession();
          // 返回一个安全值，避免上游流崩溃
          return of(null);
        }),
        finalize(() => {
          this.isRefreshing = false;
          // 清空缓存的 refresh observable（允许后续再次刷新）
          this.refresh$ = undefined;
          // 告知 init 完成（无论成功或失败）
          this.authChecked.next(true);
        }),
        // 共享同一个请求结果给所有订阅者
        shareReplay(1)
      );

    return this.refresh$;
  }

  logOut(): Observable<any> {
    // console.log('🚪 logout() called');
    return this.withLock(LOCK_KEYS.LOGOUT, () => {
      return this.user$.pipe(
        take(1),
        switchMap((user) => {
          return this.http
            .post(
              `${this.API}/sign-out`,
              { userId: user?.userId },
              { withCredentials: true }
            )
            .pipe(
              tap((res: any) => {
              //   console.log('logout >>>', res);
              this.clearSession();
              return of(null);
              // return res;
            }),
            catchError((err) => {
              // console.warn('logout failed, force clear session', err);
              this.clearSession();
              return of(null);
            })
          );
        })
      );
    });
  }

  // 判断是否登录
  isLoggedIn(): boolean {
    return !!this.accessToken && !!this.userSubject.value;
  }

  initAuthState() {
    // console.log('[initAuthState] start, accessToken:', this.accessToken);
    if (this.isRefreshing) return;
    this.isRefreshing = true;

    // ✅ 只在用户未登录时尝试刷新
    if (!this.accessToken) {
      this.refresh().subscribe({
        next: (res) => {
          // if (res) console.log('✅ 自动恢复登录状态');
        },
        error: () => {
          /* console.log('❌ 未登录或 refresh token 失效') */
        },
        complete: () => {
          this.isRefreshing = false;
          this.refresh$ = undefined;
          // console.log('authChecked -> true');
          this.authChecked.next(true); // 标记初始化完成
          // console.log('initAuthState >>');
        },
      });
    } else {
      this.isRefreshing = false;
      this.authChecked.next(true);
    }
  }

  // 清除前端会话（不发请求）
  clearSession() {
    // console.log('🔒 clearSession() called');
    this.setAccessToken(null);
    this.userSubject.next(null);
    this.authChecked.next(true);
    if (environment.enableDevMode) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_INFO_KEY);
    }
  }

  hasStoredCredentials(): boolean {
    if (!environment.enableDevMode) return false;
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  getUserInfo(): any {
    if (!environment.enableDevMode) return null;
    const info = localStorage.getItem(this.USER_INFO_KEY);
    return info ? JSON.parse(info) : null;
  }

  devModeLogin(email: string, password: string): Observable<any> {
    if (!environment.enableDevMode) {
      return this.login(email, password);
    }
    return this.login(email, password);
  }
}

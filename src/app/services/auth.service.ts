import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/authentication`;
  private accessToken = ''; // 存内存，生产环境不存 localStorage
  public auth$ = new BehaviorSubject<boolean>(false); // 登录状态 observable
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_INFO_KEY = 'user_info';

  constructor(private http: HttpClient) {
    // 本地开发模式下，从localStorage恢复登录状态
    this.initializeAuthFromStorage();
  }

  /**
   * 初始化认证状态（本地开发模式）
   */
  private initializeAuthFromStorage(): void {
    if (environment.enableDevMode) {
      const storedToken = localStorage.getItem(this.TOKEN_KEY);

      if (storedToken && storedToken.length > 0) {
        this.accessToken = storedToken;
        this.auth$.next(true);
      } else {
        this.auth$.next(false);
      }
    } else {
      // 生产环境：尝试使用refresh token刷新access token
      this.refresh().subscribe({
        next: (res) => {
          // console.log(
          //   'AuthService: Successfully refreshed access token on startup'
          // );
          // auth$状态已经在setAccessToken中更新为true
        },
        error: (error) => {
          this.auth$.next(false);
        },
      });
    }
  }

  /**
   * 保存token到localStorage（仅开发模式）
   */
  private saveTokenToStorage(token: string): void {
    if (environment.enableDevMode) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * 从localStorage删除token
   */
  private removeTokenFromStorage(): void {
    if (environment.enableDevMode) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_INFO_KEY);
    }
  }

  /** 设置内存中的 access token */
  setAccessToken(token: string) {
    this.accessToken = token;
    this.auth$.next(!!token);

    // 开发模式下保存到localStorage
    if (token && token.length > 0) {
      this.saveTokenToStorage(token);
    }
  }

  /** 获取当前 access token */
  getAccessToken() {
    return this.accessToken;
  }

  login(email: string, password: string) {
    return this.http
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
          // 设置token
          this.setAccessToken(res.accessToken);

          // 开发模式下保存用户信息到localStorage
          if (environment.enableDevMode) {
            const userInfo = {
              email: email,
              // 可以根据实际API响应调整
              user: res.user || { email: email },
              loginTime: new Date().toISOString(),
            };
            localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
          }
        })
      );
  }

  register(email: string, password: string) {
    return this.http.post(`${this.API}/sign-up`, {
      email,
      password,
    });
  }

  refresh() {
    return this.http
      .post(`${this.API}/refresh-tokens`, {}, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          this.setAccessToken(res.accessToken);
        })
      );
  }

  logOut() {
    // 清除localStorage
    this.removeTokenFromStorage();

    return this.http
      .post(`${this.API}/sign-out`, {}, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          this.setAccessToken('');
        })
      );
  }

  // 判断是否登录
  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  /**
   * 手动检查并恢复登录状态（用于调试）
   */
  checkAndRestoreLoginState(): void {
    if (environment.enableDevMode) {
      const storedToken = localStorage.getItem(this.TOKEN_KEY);
      const storedUserInfo = localStorage.getItem(this.USER_INFO_KEY);

      if (storedToken && storedToken.length > 0) {
        this.accessToken = storedToken;
        this.auth$.next(true);
      }
    } else {
      // 生产环境：尝试使用refresh token刷新access token
      this.refresh().subscribe({
        next: (res) => {
          // console.log('AuthService: Successfully refreshed access token');
        },
        error: (error) => {
          // console.log('AuthService: Refresh token failed, user not logged in');
          this.auth$.next(false);
        },
      });
    }
  }

  /**
   * 获取存储的用户信息（仅开发模式）
   */
  getUserInfo(): any {
    if (environment.enableDevMode) {
      const userInfo = localStorage.getItem(this.USER_INFO_KEY);
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  }

  /**
   * 检查是否有存储的登录信息（仅开发模式）
   */
  hasStoredCredentials(): boolean {
    if (environment.enableDevMode) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return !!(token && token.length > 0);
    }
    return false;
  }

  /**
   * 创建开发模式mock登录（绕过真实API）
   */
  devModeLogin(email: string, password: string): Observable<any> {
    if (!environment.enableDevMode) {
      return throwError(
        () => new Error('Dev mode login only available in development')
      );
    }

    // 模拟登录响应
    const mockResponse = {
      accessToken:
        'dev-mock-token-' +
        Date.now() +
        '-' +
        Math.random().toString(36).substring(2),
      refreshToken: 'dev-refresh-token-' + Date.now(),
      user: {
        email: email,
        id: 1,
        name: 'Dev User',
      },
    };

    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 500); // 模拟网络延迟
    }).pipe(
      tap((res: any) => {
        this.setAccessToken(res.accessToken);

        // 保存用户信息
        const userInfo = {
          email: email,
          user: res.user,
          loginTime: new Date().toISOString(),
          isDevMode: true,
        };
        localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
      })
    );
  }
}

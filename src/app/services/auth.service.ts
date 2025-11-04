import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/authentication`;
  private accessToken = ''; // 存内存，不存 localStorage
  public auth$ = new BehaviorSubject<boolean>(false); // 登录状态 observable

  constructor(private http: HttpClient) {}

  /** 设置内存中的 access token */
  setAccessToken(token: string) {
    this.accessToken = token;
    this.auth$.next(!!token);
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
          // console.log('res >>>', res);
          // localStorage.setItem('token', res.accessToken);
          this.setAccessToken(res.accessToken);
          // return res;
        })
      );
  }

  register(email: string, password: string) {
    return this.http.post(`${this.API}/sign-up`, {
      email,
      password,
    });

    /*  return this.http
      .post(`${this.API}/sign-up`, {
        email,
        password,
      })
      .pipe(tap((res: any) => res)); */
  }

  /*   isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // console.log(token, 'token >>', typeof token, token?.length);
    let flag = false;
    if (token) {
      if (token.length < 32) {
        return flag;
      }
      flag = true;
    }
    return flag;
  } */

  refresh() {
    return this.http
      .post(`${this.API}/refresh-tokens`, {}, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          this.setAccessToken(res.accessToken);
          // console.log('refresh res >>>', res);
          // return res;
        })
      );
  }

  logOut() {
    // localStorage.removeItem('token');
    return this.http
      .post(`${this.API}/sign-out`, {}, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          this.setAccessToken('');
          // return res;
        })
      );
  }

  // 判断是否登录
  isLoggedIn(): boolean {
    return !!this.accessToken;
  }
}

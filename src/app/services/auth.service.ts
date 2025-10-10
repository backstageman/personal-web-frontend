import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API = `${environment.apiUrl}/authentication`;
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post(`${this.API}/sign-in`, {
        email,
        password,
      })
      .pipe(
        tap((res: any) => {
          console.log('res >>>', res);
          localStorage.setItem('token', res.token);
        })
      );
  }

  register(email: string, password: string) {
    return this.http
      .post(`${this.API}/sign-up`, {
        email,
        password,
      })
      .pipe(tap((res: any) => res));
  }

  isAuthenticated(): boolean {
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
  }

  logOut() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API = 'http://localhost:3000/authentication';
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
    /*   const token = localStorage.getItem('token');
    console.log(token, 'token >>');
    if (token && token.length < 32) return false;
    return true; */
    return true;
  }

  logOut() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

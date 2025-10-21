import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  from,
  switchMap,
  take,
  throwError,
} from 'rxjs';

/* export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  // console.log(token ?? 'empty ....>>>');
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(authReq);
}; */

/* const refreshing = { flag: false }; // 函数式状态
const refreshSubject = new BehaviorSubject<boolean>(false); */

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  } else {
    authReq = req.clone({ withCredentials: true });
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return auth.refresh().pipe(
          switchMap((res) => {
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.accessToken}` },
              withCredentials: true,
            });
            return next(newReq);
          }),
          catchError((refreshErr) => {
            console.error('Refresh failed', refreshErr);
            auth.logOut().subscribe();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};

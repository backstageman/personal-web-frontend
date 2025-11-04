import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  from,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();
  const router = inject(Router);

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // console.log('err.status ><>', isRefreshing);
      if (err.status === 401 && !isRefreshing && auth.isLoggedIn()) {
        // console.log('[AuthInterceptor] Token expired. Attempting refresh...');
        isRefreshing = true;
        refreshSubject.next(null);

        return from(auth.refresh()).pipe(
          switchMap((res) => {
            isRefreshing = false;
            if (res?.accessToken) {
              // console.log('[AuthInterceptor] Token refreshed successfully');
              refreshSubject.next(res.accessToken);

              // 重新发送原始请求，带新 token
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.accessToken}` },
                withCredentials: true,
              });
              return next(newReq);
            } else {
              // 如果 refresh 没返回新 token，说明失效了
              // console.log('[AuthInterceptor] Refresh failed — logging out.');
              // handleTokenExpired();
              auth.clearSession();
              router.navigate(['/login']);
              return throwError(() => err);
            }
            // auth.logOut().subscribe();
          }),
          catchError((refreshErr) => {
            // console.error('[AuthInterceptor] Refresh error:', refreshErr);
            isRefreshing = false;
            auth.clearSession();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      } else if (err.status === 401 && isRefreshing) {
        return refreshSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token) => {
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            });
            return next(newReq);
          })
        );
      }

      return throwError(() => err);
    })
  );
};

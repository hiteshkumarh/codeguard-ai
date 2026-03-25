import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const token = authService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        toastService.showError('Session expired. Please login again.');
        authService.logout();
      } else if (error.status === 403) {
        toastService.showError('You do not have permission to perform this action.');
      } else if (error.status >= 500) {
        toastService.showError('Server error occurred. Please try again later.');
      }
      return throwError(() => error);
    })
  );
};

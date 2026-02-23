import { HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from '../services/cookie/cookie.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.getToken();

  // Si existe el token, clonamos la petición y agregamos el Header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Si no hay token, enviamos la petición original
  return next(req);
};

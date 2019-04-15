import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// Customs
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private _auth: AuthService, private _router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._auth.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: this._auth.getToken()
        }
      });
    }
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => this.handleAuthError(error)));
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this._router.navigate(['/login'], {
        queryParams: { sessionExpired: true }
      });
    }

    return throwError(error);
  }
}

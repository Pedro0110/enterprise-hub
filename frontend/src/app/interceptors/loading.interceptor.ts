import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip showing spinner for static assets to avoid flicker
    const url = req.url || '';
    if (url.includes('/assets') || url.match(/\.(svg|png|jpg|jpeg|css|js)(\?|$)/)) {
      return next.handle(req);
    }

    this.loadingService.show();
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Default handling: rethrow so components/services can still react
        // Optionally, could centralize alerting here or use AlertService
        console.error('HTTP Error:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}

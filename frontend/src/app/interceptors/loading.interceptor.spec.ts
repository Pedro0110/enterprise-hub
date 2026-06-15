import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('LoadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoadingService,
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => httpMock.verify());

  it('should call show/hide for normal requests', (done) => {
    const spyShow = spyOn(loadingService, 'show').and.callThrough();
    const spyHide = spyOn(loadingService, 'hide').and.callThrough();

    http.get('/api/test').subscribe({
      next: () => {
        expect(spyShow).toHaveBeenCalled();
      },
      complete: () => {
        expect(spyHide).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({});
  });

  it('should skip assets requests', (done) => {
    const spyShow = spyOn(loadingService, 'show').and.callThrough();
    http.get('/assets/logo.png').subscribe(() => {
      expect(spyShow).not.toHaveBeenCalled();
      done();
    });
    const req = httpMock.expectOne('/assets/logo.png');
    req.flush({});
  });
});

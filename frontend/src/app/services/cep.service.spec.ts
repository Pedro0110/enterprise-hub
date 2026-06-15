import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CepService } from './cep.service';
import { environment } from '../../environments/environment';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CepService]
    });
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch address from backend', (done) => {
    const cep = '01001000';
    const mock = { zipCode: '01001-000', street: 'Praça da Sé', neighborhood: 'Sé', city: 'São Paulo', state: 'SP' };

    service.fetchCep(cep).subscribe(address => {
      expect(address.street).toBe('Praça da Sé');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/cep/${cep}`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should fallback to cep.la when backend fails', (done) => {
    const cep = '99999999';
    const backendUrl = `${environment.apiBaseUrl}/cep/${cep}`;

    service.fetchCep(cep).subscribe(address => {
      expect(address.city).toBe('CidadeX');
      done();
    });

    const req1 = httpMock.expectOne(backendUrl);
    req1.flush({}, { status: 500, statusText: 'Server Error' });

    const req2 = httpMock.expectOne(`https://cep.la/${cep}`);
    req2.flush({ cep: cep, street: 'Rua X', neighborhood: 'Bairro X', city: 'CidadeX', state: 'XX' });
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CepService } from './cep.service';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  const viaCepUrl = (cep: string) => `http://viacep.com.br/ws/${cep}/json/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CepService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches and maps a viacep response', (done) => {
    service.fetchCep('01001000').subscribe(address => {
      expect(address.zipCode).toBe('01001-000');
      expect(address.street).toBe('Praça da Sé');
      expect(address.neighborhood).toBe('Sé');
      expect(address.city).toBe('São Paulo');
      expect(address.state).toBe('SP');
      done();
    });

    const req = httpMock.expectOne(viaCepUrl('01001000'));
    expect(req.request.method).toBe('GET');
    req.flush({
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP'
    });
  });

  it('strips non-numeric characters from the CEP before requesting', (done) => {
    service.fetchCep('01001-000').subscribe(() => done());

    const req = httpMock.expectOne(viaCepUrl('01001000'));
    expect(req.request.url).toBe(viaCepUrl('01001000'));
    req.flush({ cep: '01001-000', logradouro: '', bairro: '', localidade: '', uf: '' });
  });

  it('falls back to the cleaned CEP and empty fields when data is missing', (done) => {
    service.fetchCep('99999999').subscribe(address => {
      expect(address.zipCode).toBe('99999999');
      expect(address.street).toBe('');
      expect(address.neighborhood).toBe('');
      expect(address.city).toBe('');
      expect(address.state).toBe('');
      done();
    });

    const req = httpMock.expectOne(viaCepUrl('99999999'));
    req.flush({});
  });
});

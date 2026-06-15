import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { Address } from '../models/address';
import { environment } from '../../environments/environment';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CepService {
  private apiUrl = `${environment.apiBaseUrl}/cep`;

  constructor(private http: HttpClient) {}

  fetchCep(cep: string): Observable<Address> {
    const clean = cep.replace(/\D/g, '');

    return this.http.get<any>(`http://viacep.com.br/ws/${clean}/json/`).pipe(
      switchMap((res: any) => {
        const address: Address = {
          zipCode: res.cep || clean,
          street: res.street || res.logradouro || '',
          neighborhood: res.neighborhood || res.bairro || '',
          city: res.city || res.localidade || '',
          state: res.state || res.uf || ''
        };
        return of(address);
      }),
    );
  }
}

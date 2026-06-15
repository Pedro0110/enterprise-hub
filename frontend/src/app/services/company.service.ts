import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company';
import { Supplier } from '../models/supplier';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private apiUrl = `${environment.apiBaseUrl}/companies`;

  constructor(private http: HttpClient) {}

  list(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  create(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  update(id: string, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSuppliers(companyId: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/${companyId}/suppliers`);
  }

  associateSupplier(companyId: string, supplierId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${companyId}/suppliers/${supplierId}`, {});
  }

  dissociateSupplier(companyId: string, supplierId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${companyId}/suppliers/${supplierId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private apiUrl = `${environment.apiBaseUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  list(name?: string, documento?: string): Observable<Supplier[]> {
    let params = new HttpParams();
    if (name) params = params.set('nome', name);
    if (documento) params = params.set('documento', documento);
    return this.http.get<Supplier[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  create(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  update(id: string, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

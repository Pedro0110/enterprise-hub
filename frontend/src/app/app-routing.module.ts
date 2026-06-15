import { Routes } from '@angular/router';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './components/supplier-form/supplier-form.component';
import { CompanySuppliersComponent } from './components/company-suppliers/company-suppliers.component';

export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompanyListComponent },
  { path: 'companies/new', component: CompanyFormComponent },
  { path: 'companies/:id/edit', component: CompanyFormComponent },
  { path: 'companies/:id/suppliers', component: CompanySuppliersComponent },
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'suppliers/new', component: SupplierFormComponent },
  { path: 'suppliers/:id/edit', component: SupplierFormComponent }
];


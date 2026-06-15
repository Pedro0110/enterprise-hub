import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';

import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './components/supplier-form/supplier-form.component';
import { CompanySuppliersComponent } from './components/company-suppliers/company-suppliers.component';
import { AddressInputComponent } from './components/address-input/address-input.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { CpfCnpjPipe } from './shared/pipes/cpf-cnpj.pipe';
import { CepPipe } from './shared/pipes/cep.pipe';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { CpfCnpjMaskDirective } from './shared/directives/cpf-cnpj-mask.directive';
import { CepMaskDirective } from './shared/directives/cep-mask.directive';
import { CnpjMaskDirective } from './shared/directives/cnpj-mask.directive';
import { CpfMaskDirective } from './shared/directives/cpf-mask.directive';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { ConfirmDialogComponent } from './shared/services/confirm-dialog.service';

@NgModule({
  declarations: [
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgbAlertModule,
    AppComponent,
    ToastContainerComponent,
    CompanyListComponent,
    SupplierListComponent,
    SupplierFormComponent,
    CompanySuppliersComponent,
    SpinnerComponent,
    AddressInputComponent,
    CpfCnpjPipe,
    CepPipe,
    DateFormatPipe,
    CpfCnpjMaskDirective,
    CepMaskDirective,
    CompanyFormComponent,
    CpfMaskDirective,
    CnpjMaskDirective
  ],
   providers: [
     { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
   ],
})
export class AppModule { }

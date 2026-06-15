import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';
import { CpfCnpjPipe } from '../../shared/pipes/cpf-cnpj.pipe';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CpfCnpjPipe
  ]
})
export class CompanyListComponent implements OnInit {
  private companiesSubject = new BehaviorSubject<Company[]>([]);
  companies$ = this.companiesSubject.asObservable();
  error = '';

  constructor(
    private companyService: CompanyService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.list().subscribe({
      next: (companies) => {
        console.log('loadCompanies: received', companies.length);
        this.companiesSubject.next(companies);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('loadCompanies erro', err);
        this.error = 'Erro ao carregar empresas';
      }
    });
  }

  deleteCompany(id: string): void {
    this.confirmDialog.confirm(
      'Excluir Empresa',
      'Tem certeza que deseja excluir esta empresa?'
    ).subscribe((confirmed) => {
      if (confirmed) {
        console.error('deleteCompany: deleting', id);
        const prev = this.companiesSubject.value;
        const updated = prev.filter(c => c.idCompany !== id);
        console.info('deleteCompany: optimistic remove', id, 'prevCount=', prev.length, 'newCount=', updated.length);
        this.companiesSubject.next(updated);
        this.cdr.markForCheck();

        this.companyService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Empresa excluída com sucesso');
            this.loadCompanies();
          },
          error: (err) => {
            console.error('deleteCompany erro', err);
            this.companiesSubject.next(prev);
            this.cdr.markForCheck();
            this.toastService.error(err.error?.message || 'Erro ao excluir empresa');
          }
        });
      }
    });
  }
}

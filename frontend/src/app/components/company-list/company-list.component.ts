import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company';
import { Observable } from 'rxjs';
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
  companies$!: Observable<Company[]>;
  error = '';

  constructor(
    private companyService: CompanyService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companies$ = this.companyService.list();
  }

  deleteCompany(id: string): void {
    this.confirmDialog.confirm(
      'Excluir Empresa',
      'Tem certeza que deseja excluir esta empresa?'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.companyService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Empresa excluída com sucesso');
            this.loadCompanies();
          },
          error: (err) => this.toastService.error(err.error?.message || 'Erro ao excluir empresa')
        });
      }
    });
  }
}

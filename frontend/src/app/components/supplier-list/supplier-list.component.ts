import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier';
import { Observable } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';
import { CpfCnpjPipe } from '../../shared/pipes/cpf-cnpj.pipe';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CpfCnpjPipe
  ]
})
export class SupplierListComponent implements OnInit {
  suppliers$!: Observable<Supplier[]>;
  error = '';
  filterName = '';
  filterDocument = '';

  constructor(
    private supplierService: SupplierService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.suppliers$ = this.supplierService.list(this.filterName || undefined, this.filterDocument || undefined);
  }

  clearFilters(): void {
    this.filterName = '';
    this.filterDocument = '';
    this.search();
  }

  deleteSupplier(id: string): void {
    this.confirmDialog.confirm(
      'Excluir Fornecedor',
      'Tem certeza que deseja excluir este fornecedor?'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.supplierService.delete(id).subscribe({
          next: () => {
            this.toastService.success('Fornecedor excluído com sucesso');
            this.search();
          },
          error: (err) => this.toastService.error(err.error?.message || 'Erro ao excluir fornecedor')
        });
      }
    });
  }
}

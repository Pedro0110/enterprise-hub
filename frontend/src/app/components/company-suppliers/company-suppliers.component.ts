import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { SupplierService } from '../../services/supplier.service';
import { ToastService } from '../../shared/services/toast.service';
import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';
import { Company } from '../../models/company';
import { Supplier } from '../../models/supplier';
import { CpfCnpjPipe } from '../../shared/pipes/cpf-cnpj.pipe';

@Component({
  selector: 'app-company-suppliers',
  templateUrl: './company-suppliers.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CpfCnpjPipe
  ]
})
export class CompanySuppliersComponent implements OnInit {
  company: Company | null = null;
  linkedSuppliers: Supplier[] = [];
  allSuppliers: Supplier[] = [];
  selectedSupplierId: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private supplierService: SupplierService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('id')!;
    this.loadCompany(companyId);
    this.loadAllSuppliers();
    this.loadLinkedSuppliers(companyId);
  }

  loadCompany(id: string): void {
    this.companyService.getById(id).subscribe({
      next: (company) => this.company = company,
      error: () => this.toastService.error('Empresa não encontrada')
    });
  }

  loadLinkedSuppliers(companyId: string): void {
    this.companyService.getSuppliers(companyId).subscribe({
      next: (suppliers) => this.linkedSuppliers = suppliers,
      error: () => this.toastService.error('Erro ao carregar fornecedores vinculados')
    });
  }

  loadAllSuppliers(): void {
    this.supplierService.list().subscribe({
      next: (suppliers) => this.allSuppliers = suppliers,
      error: () => this.toastService.error('Erro ao carregar fornecedores')
    });
  }

  associate(): void {
    if (!this.selectedSupplierId || !this.company?.idCompany) return;
    this.companyService.associateSupplier(this.company.idCompany, this.selectedSupplierId).subscribe({
      next: () => {
        this.toastService.success('Fornecedor vinculado com sucesso');
        this.loadLinkedSuppliers(this.company!.idCompany!);
        this.selectedSupplierId = null;
      },
      error: (err) => this.toastService.error(err.error?.message || 'Erro ao vincular fornecedor')
    });
  }

  dissociate(supplierId: string): void {
    if (!this.company?.idCompany) return;
    this.confirmDialog.confirm(
      'Remover Vínculo',
      'Remover vínculo com este fornecedor?'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.companyService.dissociateSupplier(this.company!.idCompany!, supplierId).subscribe({
          next: () => {
            this.toastService.info('Vínculo removido com sucesso');
            this.loadLinkedSuppliers(this.company!.idCompany!);
          },
          error: (err) => this.toastService.error(err.error?.message || 'Erro ao remover vínculo')
        });
      }
    });
  }
}

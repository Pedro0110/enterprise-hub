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
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
  // Removed local loading flag in favor of global LoadingService
  isLoading$!: Observable<boolean>;
  private pendingRequests = 0;
  allDataLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private supplierService: SupplierService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService
    ,
    private loadingService: LoadingService
  ) {
    this.isLoading$ = this.loadingService.isLoading$;
  }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('id')!;
    this.loadCompany(companyId);
    this.loadAllSuppliers();
    this.loadLinkedSuppliers(companyId);
  }

  loadCompany(id: string): void {
    // rely on the global LoadingService (via interceptor) for showing spinner
    this.pendingRequests++;
    this.companyService.getById(id).pipe(
      finalize(() => this.requestDone())
    ).subscribe({
      next: (company) => {
        // Defensive: backend might return an array (suppliers) by mistake.
        if (!company) {
          console.warn('loadCompany: resposta vazia para id', id);
          this.company = null;
          this.toastService.error('Empresa não encontrada');
          return;
        }

        const asAny: any = company as any;
        if (Array.isArray(asAny)) {
          // Unexpected: got suppliers array where company was expected.
          console.warn('loadCompany: recebeu array em vez de empresa', asAny);
          // If it's an array of suppliers, populate the suppliers list so user can still see them
          this.linkedSuppliers = asAny as unknown as Supplier[];
          this.company = null;
          this.toastService.error('Resposta inesperada do servidor: empresa não encontrada');
          return;
        }

        // Normal case
        this.company = company as Company;
      },
      error: (err) => {
        console.error('loadCompany erro', err);
        this.toastService.error('Empresa não encontrada');
      }
    });
  }

  loadLinkedSuppliers(companyId: string): void {
    this.pendingRequests++;
    this.companyService.getSuppliers(companyId).pipe(
      finalize(() => this.requestDone())
    ).subscribe({
      next: (suppliers) => {
        this.linkedSuppliers = suppliers;
      },
      error: (err) => {
        console.error('loadLinkedSuppliers erro', err);
        this.toastService.error('Erro ao carregar fornecedores vinculados');
      }
    });
  }

  loadAllSuppliers(): void {
    this.pendingRequests++;
    this.supplierService.list().pipe(
      finalize(() => this.requestDone())
    ).subscribe({
      next: (suppliers) => {
        this.allSuppliers = suppliers;
      },
      error: (err) => {
        console.error('loadAllSuppliers erro', err);
        this.toastService.error('Erro ao carregar fornecedores');
      }
    });
  }

   private requestDone() {
     this.pendingRequests--;
     if (this.pendingRequests <= 0) {
       // Safety: if global loading remains active for any reason, reset it when our component requests finish
       this.loadingService.reset();
       this.pendingRequests = 0;
       this.allDataLoaded = true;
     }
   }

   /**
    * Returns suppliers available for linking (not already linked to this company)
    */
   get availableSuppliers(): Supplier[] {
     const linkedIds = new Set(this.linkedSuppliers.map(s => s.idSupplier));
     return this.allSuppliers.filter(supplier => !linkedIds.has(supplier.idSupplier));
   }

  associate(): void {
    if (!this.selectedSupplierId || !this.company?.idCompany) return;
    this.pendingRequests++;
    this.companyService.associateSupplier(this.company.idCompany, this.selectedSupplierId).pipe(
      finalize(() => this.requestDone())
    ).subscribe({
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
        this.pendingRequests++;
        this.companyService.dissociateSupplier(this.company!.idCompany!, supplierId).pipe(
          finalize(() => this.requestDone())
        ).subscribe({
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

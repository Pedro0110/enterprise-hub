import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { ToastService } from '../../shared/services/toast.service';
import { AddressInputComponent } from '../address-input/address-input.component';
import { CpfMaskDirective } from '../../shared/directives/cpf-mask.directive';
import { CnpjMaskDirective } from '../../shared/directives/cnpj-mask.directive';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    AddressInputComponent,
    CpfMaskDirective,
    CnpjMaskDirective
]
})
export class SupplierFormComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  supplierId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      documentNumber: ['', Validators.required],
      documentType: ['J', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rg: [''],
      birthDate: [''],
      addressZipCode: ['', Validators.required],
      addressStreet: [''],
      addressNeighborhood: [''],
      addressCity: [''],
      addressState: [''],
      addressNumber: ['']
    });
    this.manageConditionalValidators();
    this.form.get('documentType')?.valueChanges.subscribe(() => {
      this.manageConditionalValidators();
    });
    this.supplierId = this.route.snapshot.paramMap.get('id');
    if (this.supplierId) {
      this.editMode = true;
      this.loadSupplier(this.supplierId);
    }
  }

  manageConditionalValidators(): void {
    const type = this.form.get('documentType')?.value;
    if (type === 'F') {
      this.form.get('rg')?.setValidators(Validators.required);
      this.form.get('birthDate')?.setValidators(Validators.required);
    } else {
      this.form.get('rg')?.clearValidators();
      this.form.get('birthDate')?.clearValidators();
    }
    this.form.get('rg')?.updateValueAndValidity();
    this.form.get('birthDate')?.updateValueAndValidity();
  }

  loadSupplier(id: string): void {
    this.supplierService.getById(id).subscribe({
      next: (supplier) => {
        this.form.patchValue({
          documentNumber: supplier.documentNumber,
          documentType: supplier.documentType,
          name: supplier.name,
          email: supplier.email,
          rg: supplier.rg,
          birthDate: supplier.birthDate,
          addressZipCode: supplier.addressZipCode,
          addressStreet: supplier.addressStreet,
          addressNeighborhood: supplier.addressNeighborhood,
          addressCity: supplier.addressCity,
          addressState: supplier.addressState,
          addressNumber: supplier.addressNumber
        });
      },
      error: () => this.toastService.error('Fornecedor não encontrado')
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const data = this.form.value;
    const operation = this.editMode
      ? this.supplierService.update(this.supplierId!, data)
      : this.supplierService.create(data);
    operation.subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success(this.editMode ? 'Fornecedor atualizado com sucesso' : 'Fornecedor cadastrado com sucesso');
        this.router.navigate(['/suppliers']);
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Erro ao salvar fornecedor');
      }
    });
  }
}

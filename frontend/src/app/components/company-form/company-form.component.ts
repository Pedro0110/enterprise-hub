import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { ToastService } from '../../shared/services/toast.service';
import { AddressInputComponent } from '../address-input/address-input.component';
import { CnpjMaskDirective } from '../../shared/directives/cnpj-mask.directive';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    AddressInputComponent,
    CnpjMaskDirective
]
})
export class CompanyFormComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  companyId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      tradeName: ['', Validators.required],
      addressZipCode: ['', Validators.required],
      addressStreet: [''],
      addressNeighborhood: [''],
      addressCity: [''],
      addressState: [''],
      addressNumber: ['']
    });
    this.companyId = this.route.snapshot.paramMap.get('id');
    if (this.companyId) {
      this.editMode = true;
      this.loadCompany(this.companyId);
    }
  }

  loadCompany(id: string): void {
    this.companyService.getById(id).subscribe({
      next: (company) => {
        this.form.patchValue({
          documentNumber: company.documentNumber,
          tradeName: company.tradeName,
          addressZipCode: company.addressZipCode,
          addressStreet: company.addressStreet,
          addressNeighborhood: company.addressNeighborhood,
          addressCity: company.addressCity,
          addressState: company.addressState,
          addressNumber: company.addressNumber
        });
      },
      error: () => this.toastService.error('Empresa não encontrada')
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const data = this.form.value;
    const operation = this.editMode
      ? this.companyService.update(this.companyId!, data)
      : this.companyService.create(data);
    operation.subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success(this.editMode ? 'Empresa atualizada com sucesso' : 'Empresa cadastrada com sucesso');
        this.router.navigate(['/companies']);
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Erro ao salvar empresa');
      }
    });
  }
}

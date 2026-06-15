import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CepService } from '../../services/cep.service';
import { LoadingService } from '../../services/loading.service';
import { CepMaskDirective } from '../../shared/directives/cep-mask.directive';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CepMaskDirective
  ]
})
export class AddressInputComponent {
  @Input() form!: FormGroup;
  @Output() addressFilled = new EventEmitter<void>();

  loadingCep = false;

  readonly brazilianStates: { code: string; name: string }[] = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
  ];

  constructor(private cepService: CepService, private loadingService: LoadingService) {}

  compareState = (a: string | null, b: string | null): boolean =>
    (a ?? '').toUpperCase() === (b ?? '').toUpperCase();

  buscarCep(): void {
    const cep: string = this.form.get('addressZipCode')?.value;
    if (!cep || this.loadingCep) return;
    const clean = cep.replace(/\D/g, '');
    if (clean.length < 8) return;

    this.loadingCep = true;
    this.loadingService.show();
    this.cepService.fetchCep(clean).subscribe({
      next: (address) => {
        this.form.patchValue({
          addressStreet: address.street,
          addressNeighborhood: address.neighborhood,
          addressCity: address.city,
          addressState: (address.state ?? '').toUpperCase()
        });
        this.addressFilled.emit();
      },
      error: () => {
        this.form.get('addressZipCode')?.setErrors({ notFound: true });
        this.loadingCep = false;
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingCep = false;
        this.loadingService.hide();
      }
    });
  }
}

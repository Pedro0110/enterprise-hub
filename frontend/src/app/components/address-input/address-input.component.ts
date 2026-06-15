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

  constructor(private cepService: CepService, private loadingService: LoadingService) {}

  buscarCep(): void {
    const cep: string = this.form.get('addressZipCode')?.value;
    if (!cep) return;
    const clean = cep.replace(/\D/g, '');
    if (clean.length < 8) return;

    this.loadingService.show();
    this.cepService.fetchCep(clean).subscribe({
      next: (address) => {
        this.form.patchValue({
          addressStreet: address.street,
          addressNeighborhood: address.neighborhood,
          addressCity: address.city,
          addressState: address.state
        });
        this.addressFilled.emit();
      },
      error: () => {
        this.form.get('addressZipCode')?.setErrors({ notFound: true });
      },
      complete: () => this.loadingService.hide()
    });
  }
}

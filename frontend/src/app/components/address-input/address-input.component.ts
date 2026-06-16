import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CepService } from '../../services/cep.service';
import { LoadingService } from '../../services/loading.service';
import { CepMaskDirective } from '../../shared/directives/cep-mask.directive';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CepMaskDirective
  ]
})
export class AddressInputComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Output() addressFilled = new EventEmitter<void>();

  loadingCep = false;

  private readonly destroy$ = new Subject<void>();

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

  ngOnInit(): void {
    const stateControl = this.form?.get('addressState');
    if (!stateControl) return;

    // O UF pode chegar de registros já existentes em caixa diferente (o campo
    // antigo só aplicava uppercase via CSS). Normalizamos para maiúsculas — na
    // carga inicial e a cada mudança — para que o valor sempre corresponda a
    // uma opção do select (a API de CEP já retorna o UF em maiúsculas).
    this.normalizeState(stateControl.value);
    stateControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.normalizeState(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Compara o valor do controle com o valor da opção de forma case-insensitive.
   */
  compareState = (a: string | null, b: string | null): boolean =>
    (a ?? '').toUpperCase() === (b ?? '').toUpperCase();

  fetchAddressByZipCode(): void {
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

  private normalizeState(value: string | null): void {
    if (typeof value !== 'string') return;
    const upper = value.toUpperCase();
    if (upper !== value) {
      this.form.get('addressState')?.setValue(upper, { emitEvent: false });
    }
  }
}

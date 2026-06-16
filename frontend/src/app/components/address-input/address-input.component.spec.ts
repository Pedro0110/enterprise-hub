import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, throwError, Subject } from 'rxjs';

import { AddressInputComponent } from './address-input.component';
import { CepService } from '../../services/cep.service';
import { LoadingService } from '../../services/loading.service';
import { Address } from '../../models/address';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;
  let cepService: jasmine.SpyObj<CepService>;

  const sampleAddress: Address = {
    zipCode: '01001-000',
    street: 'Praça da Sé',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP'
  };

  function buildForm(state = ''): FormGroup {
    return new FormGroup({
      addressZipCode: new FormControl('', Validators.required),
      addressStreet: new FormControl(''),
      addressNeighborhood: new FormControl(''),
      addressCity: new FormControl(''),
      addressState: new FormControl(state),
      addressNumber: new FormControl('')
    });
  }

  function selectEl(): HTMLSelectElement {
    return fixture.debugElement.query(By.css('#addressState')).nativeElement;
  }

  function searchButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('.input-group button')).nativeElement;
  }

  beforeEach(async () => {
    const cepSpy = jasmine.createSpyObj<CepService>('CepService', ['fetchCep']);

    await TestBed.configureTestingModule({
      imports: [AddressInputComponent],
      providers: [
        { provide: CepService, useValue: cepSpy },
        LoadingService
      ]
    }).compileComponents();

    cepService = TestBed.inject(CepService) as jasmine.SpyObj<CepService>;
    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    component.form = buildForm();
  });

  it('creates the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('UF select', () => {
    it('renders a placeholder plus all 27 Brazilian states', () => {
      fixture.detectChanges();
      const options = fixture.debugElement.queryAll(By.css('#addressState option'));

      expect(options.length).toBe(28);
      expect(options[0].nativeElement.value).toBe('');

      const codes = options.slice(1).map(o => o.nativeElement.value);
      expect(new Set(codes).size).toBe(27);
      ['SP', 'RJ', 'MG', 'DF', 'RS'].forEach(code => expect(codes).toContain(code));
    });

    it('selects the option that matches an existing record', () => {
      component.form = buildForm('RJ');
      fixture.detectChanges();

      const el = selectEl();
      expect(el.options[el.selectedIndex].value).toBe('RJ');
    });

    it('normalizes a lowercase existing record so the option still matches', () => {
      component.form = buildForm('sp');
      fixture.detectChanges();

      expect(component.form.get('addressState')!.value).toBe('SP');
      const el = selectEl();
      expect(el.options[el.selectedIndex].value).toBe('SP');
    });

    it('writes the selected UF back to the form control', () => {
      fixture.detectChanges();

      const el = selectEl();
      const option = Array.from(el.options).find(o => o.value === 'BA')!;
      el.value = option.value;
      el.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.form.get('addressState')!.value).toBe('BA');
    });
  });

  describe('CEP lookup', () => {
    it('patches the address and emits addressFilled on success', () => {
      cepService.fetchCep.and.returnValue(of(sampleAddress));
      const emitSpy = spyOn(component.addressFilled, 'emit');
      fixture.detectChanges();
      component.form.get('addressZipCode')!.setValue('01001-000');

      component.fetchAddressByZipCode();

      expect(cepService.fetchCep).toHaveBeenCalledWith('01001000');
      expect(component.form.get('addressStreet')!.value).toBe('Praça da Sé');
      expect(component.form.get('addressNeighborhood')!.value).toBe('Sé');
      expect(component.form.get('addressCity')!.value).toBe('São Paulo');
      expect(component.form.get('addressState')!.value).toBe('SP');
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(component.loadingCep).toBeFalse();
    });

    it('uppercases the state returned by the API', () => {
      cepService.fetchCep.and.returnValue(of({ ...sampleAddress, state: 'sp' }));
      fixture.detectChanges();
      component.form.get('addressZipCode')!.setValue('01001000');

      component.fetchAddressByZipCode();

      expect(component.form.get('addressState')!.value).toBe('SP');
    });

    it('flags the CEP as not found and shows the error message on failure', () => {
      cepService.fetchCep.and.returnValue(throwError(() => new Error('not found')));
      fixture.detectChanges();
      const zip = component.form.get('addressZipCode')!;
      zip.setValue('99999999');
      zip.markAsTouched();

      component.fetchAddressByZipCode();
      fixture.detectChanges();

      expect(zip.errors).toEqual({ notFound: true });
      expect(component.loadingCep).toBeFalse();
      const error = fixture.debugElement.query(By.css('#addressZipCodeError'));
      expect(error.nativeElement.textContent).toContain('CEP não encontrado');
    });

    it('does not call the service when the CEP has fewer than 8 digits', () => {
      fixture.detectChanges();
      component.form.get('addressZipCode')!.setValue('123');

      component.fetchAddressByZipCode();

      expect(cepService.fetchCep).not.toHaveBeenCalled();
    });

    it('does not call the service when the CEP is empty', () => {
      fixture.detectChanges();

      component.fetchAddressByZipCode();

      expect(cepService.fetchCep).not.toHaveBeenCalled();
    });

    it('triggers the lookup when the Buscar button is clicked', () => {
      cepService.fetchCep.and.returnValue(of(sampleAddress));
      fixture.detectChanges();
      component.form.get('addressZipCode')!.setValue('01001000');
      fixture.detectChanges();

      searchButton().click();

      expect(cepService.fetchCep).toHaveBeenCalledWith('01001000');
    });

    it('disables the button and shows a spinner while loading', () => {
      cepService.fetchCep.and.returnValue(new Subject<Address>().asObservable());
      fixture.detectChanges();
      component.form.get('addressZipCode')!.setValue('01001000');

      component.fetchAddressByZipCode();
      fixture.detectChanges();

      expect(component.loadingCep).toBeTrue();
      expect(searchButton().disabled).toBeTrue();
      expect(fixture.debugElement.query(By.css('.spinner-border'))).toBeTruthy();
    });
  });

  describe('CEP validation message', () => {
    it('shows the required hint when the field is touched and empty', () => {
      fixture.detectChanges();
      component.form.get('addressZipCode')!.markAsTouched();
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('#addressZipCodeError'));
      expect(error.nativeElement.textContent).toContain('CEP obrigatório');
    });
  });

  it('compareState compares UF codes case-insensitively', () => {
    expect(component.compareState('sp', 'SP')).toBeTrue();
    expect(component.compareState('SP', 'SP')).toBeTrue();
    expect(component.compareState(null, '')).toBeTrue();
    expect(component.compareState('SP', 'RJ')).toBeFalse();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressInputComponent } from './address-input.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CepService } from '../../services/cep.service';
import { of, throwError } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;
  let cepService: jasmine.SpyObj<CepService>;

  beforeEach(async () => {
    const cepSpy = jasmine.createSpyObj('CepService', ['consultar']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddressInputComponent],
      providers: [
        { provide: CepService, useValue: cepSpy },
        LoadingService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    cepService = TestBed.inject(CepService) as jasmine.SpyObj<CepService>;
    component.form = new FormGroup({
      addressZipCode: new FormControl(''),
      addressStreet: new FormControl(''),
      addressNeighborhood: new FormControl(''),
      addressCity: new FormControl(''),
      addressState: new FormControl('')
    });
  });

  it('should patch form when cep found', () => {
    const mockAddress = { zipCode: '01001-000', street: 'Praça', neighborhood: 'Sé', city: 'São Paulo', state: 'SP' };
    cepService.fetchCep.and.returnValue(of(mockAddress as any));

    component.form.get('addressZipCode')?.setValue('01001000');
    component.buscarCep();

    expect(component.form.get('addressStreet')?.value).toBe('Praça');
  });

  it('should set error when cep not found', () => {
    cepService.fetchCep.and.returnValue(throwError(() => new Error('Not found')));
    component.form.get('addressZipCode')?.setValue('99999999');
    component.buscarCep();
    expect(component.form.get('addressZipCode')?.errors).toEqual({ notFound: true });
  });
});

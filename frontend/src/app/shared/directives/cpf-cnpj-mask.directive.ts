import { Directive, HostListener, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'input[appCpfCnpjMask]',
  standalone: true
})
export class CpfCnpjMaskDirective implements OnInit, OnDestroy {
  @Input('appCpfCnpjMask') documentTypeControl?: AbstractControl | null;
  private controlSub?: Subscription;
  private mode: 'F' | 'J' | 'AUTO' = 'AUTO'; // F = CPF, J = CNPJ, AUTO = decide by length

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.documentTypeControl) {
      // set initial mode
      const v = this.documentTypeControl.value;
      this.mode = v === 'F' ? 'F' : v === 'J' ? 'J' : 'AUTO';
      // subscribe to changes
      this.controlSub = this.documentTypeControl.valueChanges.subscribe((val: any) => {
        this.mode = val === 'F' ? 'F' : val === 'J' ? 'J' : 'AUTO';
        // update maxlength according to mode
        const input = this.el.nativeElement as HTMLInputElement;
        input.maxLength = this.mode === 'J' ? 18 : (this.mode === 'F' ? 14 : 18);
      });
      // ensuremaxlength initially
      const input = this.el.nativeElement as HTMLInputElement;
      input.maxLength = this.mode === 'J' ? 18 : (this.mode === 'F' ? 14 : 18);
    }
  }

  ngOnDestroy(): void {
    this.controlSub?.unsubscribe();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '');

    // If mode forced, limit digits accordingly
    if (this.mode === 'F') {
      if (digits.length > 11) digits = digits.substring(0, 11);
    } else if (this.mode === 'J') {
      if (digits.length > 14) digits = digits.substring(0, 14);
    }

    let value = digits;

    if (this.mode === 'F') {
      // CPF format: 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    } else if (this.mode === 'J') {
      // CNPJ format: 00.000.000/0000-00
      value = value.replace(/(\d{2})(\d)/, '$1.$2');
      value = value.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
      value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
    } else {
      // AUTO: decide based on digits length
      if (digits.length <= 11) {
        value = digits.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
      } else {
        value = digits.replace(/(\d{2})(\d)/, '$1.$2');
        value = value.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
        value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
      }
    }

    input.value = value;
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');

    if (digits.length === 0) return;

    if (this.mode === 'F' && digits.length !== 11) {
      input.value = '';
    } else if (this.mode === 'J' && digits.length !== 14) {
      input.value = '';
    } else if (this.mode === 'AUTO' && digits.length !== 11 && digits.length !== 14) {
      input.value = '';
    }
  }
}

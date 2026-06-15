import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: 'input[appCnpjMask]',
  standalone: true
})
export class CnpjMaskDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {
    // Ensure the input won't accept more characters than the formatted CNPJ (18 chars)
    try {
      this.el.nativeElement.maxLength = 18;
    } catch (e) {
      // ignore if not applicable
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    // Limit to 14 digits for CNPJ
    if (value.length > 14) value = value.substring(0, 14);

    // Apply CNPJ mask: 00.000.000/0000-00
    value = value.replace(/(\d{2})(\d)/, '$1.$2');
    value = value.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
    value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');

    input.value = value;
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement;
    const digits = input.value.replace(/\D/g, '');
    // If not full 14 digits, clear the field (as requested)
    if (digits.length > 0 && digits.length !== 14) {
      input.value = '';
    }
  }
}

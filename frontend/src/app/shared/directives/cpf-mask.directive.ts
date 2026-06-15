import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: 'input[appCpfMask]',
  standalone: true
})
export class CpfMaskDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {
    try {
      this.el.nativeElement.maxLength = 14; // formatted CPF length
    } catch (e) {}
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) value = value.substring(0, 11);

    // CPF: 000.000.000-00
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

    input.value = value;
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement;
    const digits = input.value.replace(/\D/g, '');
    if (digits.length > 0 && digits.length !== 11) {
      input.value = '';
    }
  }
}

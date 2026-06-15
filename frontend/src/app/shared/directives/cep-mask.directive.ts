import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: 'input[appCepMask]',
  standalone: true
})
export class CepMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    // CEP format: 00000-000
    if (value.length >= 5) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }

    // Limita a 8 dígitos
    if (value.replace(/\D/g, '').length > 8) {
      value = value.substring(0, 9); // 5 dígitos + hífen + 3 dígitos
    }

    input.value = value;
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement;
    const value = input.value.replace(/\D/g, '');

    // CEP deve ter 8 dígitos
    if (value.length > 0 && value.length !== 8) {
      input.value = '';
    }
  }
}

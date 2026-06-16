import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CepMaskDirective } from './cep-mask.directive';

@Component({
  standalone: true,
  imports: [CepMaskDirective],
  template: `<input appCepMask id="test" type="text">`
})
class TestHostComponent {}

describe('CepMaskDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    input = fixture.debugElement.query(By.css('input'));
  });

  function type(value: string): HTMLInputElement {
    const el = input.nativeElement as HTMLInputElement;
    el.value = value;
    el.dispatchEvent(new Event('input'));
    return el;
  }

  it('formats the CEP with a hyphen as the user types', () => {
    expect(type('12345678').value).toBe('12345-678');
  });

  it('limits the value to 8 digits', () => {
    const el = type('123456789');
    expect(el.value.replace(/\D/g, '').length).toBeLessThanOrEqual(8);
  });

  it('does not add a hyphen before the fifth digit', () => {
    expect(type('123').value).toBe('123');
  });

  it('clears an incomplete CEP on blur', () => {
    const el = type('123');
    el.dispatchEvent(new Event('blur'));
    expect(el.value).toBe('');
  });

  it('keeps a complete CEP on blur', () => {
    const el = type('12345678');
    el.dispatchEvent(new Event('blur'));
    expect(el.value).toBe('12345-678');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { CepMaskDirective } from './cep-mask.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input appCepMask id="test" type="text">`
})
class TestComponent {}

describe('CepMaskDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let input: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, CepMaskDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css('input'));
  });

  it('should format CEP correctly', () => {
    const inputElement = input.nativeElement as HTMLInputElement;
    inputElement.value = '12345678';
    inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe('12345-678');
  });

  it('should limit to 8 digits', () => {
    const inputElement = input.nativeElement as HTMLInputElement;
    inputElement.value = '123456789';
    inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value.replace(/\D/g, '').length).toBeLessThanOrEqual(8);
  });
});

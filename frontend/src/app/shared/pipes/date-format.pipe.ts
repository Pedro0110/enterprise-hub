import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = (value instanceof Date) ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR');
  }
}

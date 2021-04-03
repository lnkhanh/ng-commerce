import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone' })
export class PhonePipe implements PipeTransform {
  transform = (value: number | string): string => {
    if (!value) { return '--'; }
    if (value.toString().indexOf('-') >= 0) {
      value = value.toString().split('-').join('');
    }
    if (value.toString().indexOf('(') >= 0 || value.toString().indexOf(')') >= 0) {
      value = value.toString().split('(').join('');
      value = value.toString().split(')').join('');
    }
    const num1 = String(value).substr(0, 3);
    const num2 = String(value).substr(3, 3);
    const num3 = String(value).substr(6, 4);
    const format = `(${num1}) ${num2}-${num3}`;

    return format;
  }
}

@Pipe({name: 'numberFormat'})
export class NumberFormatPipe implements PipeTransform {
  transform = (value: number | string): string => {
    return new Intl.NumberFormat('us', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5
    }).format(Number(value));
  }
}

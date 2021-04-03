import { Pipe, PipeTransform } from '@angular/core';

import { includes } from 'lodash-es';


@Pipe({ name: 'includes' })
export class IncludesPipe implements PipeTransform {
  transform = (array: Array<string | number>, value: string | number): boolean => includes(array, value);
}

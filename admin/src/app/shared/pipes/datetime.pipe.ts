import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import { AdminConfig } from '@core/index';

@Pipe({ name: 'fullDatetime' })
export class FullDateTimePipe implements PipeTransform {
  transform = (value: Date | string): string =>
    value ? moment(value).format(AdminConfig.format.dateTimeAM) : '--'
}

@Pipe({ name: 'shortDatetime' })
export class ShortDateTimePipe implements PipeTransform {
  transform = (value: Date | string): string =>
    value ? moment(value).format(AdminConfig.format.date) : '--'
}

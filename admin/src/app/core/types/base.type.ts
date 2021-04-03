import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

import { AdminConfig } from '@core/configs';

export const BASE_FIELD_MAP = {
  id: 'ID',
  createdBy: 'CreatedBy',
  createdDate: 'CreatedDate',
  modifiedBy: 'ModifiedBy',
  modifiedDate: 'ModifiedDate',
};
const BASE_IGNORE_FIELDS = [
  'ID',
  'CreatedBy',
  'CreatedDate',
  'ModifiedBy',
  'ModifiedDate',
];

export abstract class BaseMoment {
  moment: moment.Moment = null;
  _valueMaterial: string = null;

  abstract isTimeDifferenceHandle: boolean;
  abstract shortFormat: string;
  abstract apiFormat: string;

  get short(): string {
    return !_.isEmpty(this.moment)
      ? this.moment.format(this.shortFormat)
      : null;
  }

  set short(value: string) {
    this.moment = value ? moment(value) : null;
  }

  get matDatepicker(): string {
    return !!this._valueMaterial ? this._valueMaterial : null;
  }

  set matDatepicker(value: string) {
    this.moment = value ? moment(value) : null;
    this._valueMaterial = value;
  }

  get dayMonth(): string {
    return !_.isEmpty(this.moment)
      ? this.moment.format(AdminConfig.format.dayMonth)
      : null;
  }

  get dayMonthYear(): string {
    return !_.isEmpty(this.moment)
      ? this.moment.format(AdminConfig.format.apiDateMonthYear)
      : null;
  }

  public fromData(value?: string, format?: string) {
    if (!_.isEmpty(value)) {
      if (_.isEmpty(format)) {
        format = this.apiFormat;
      }

      this.moment = moment(value, format);
      if (this.isTimeDifferenceHandle) {
        this.moment.utc(true).local();
      }
    }

    return this;
  }

  public toData(format?: string): string {
    if (_.isEmpty(this.moment)) {
      return null;
    }

    if (_.isEmpty(format)) {
      format = this.apiFormat;
    }

    if (this.isTimeDifferenceHandle) {
      this.moment.utc();
    }
    return this.moment.format(format);
  }

  isEmpty = () => _.isEmpty(this.moment);

  setEmpty = () => {
    this.moment = null;
  }
}

export class DateMoment extends BaseMoment {
  isTimeDifferenceHandle = false;
  shortFormat = AdminConfig.format.date;
  apiFormat = AdminConfig.format.apiDate;
}

export class TimeMoment extends BaseMoment {
  isTimeDifferenceHandle = true;
  shortFormat = AdminConfig.format.dateTime;
  apiFormat = AdminConfig.format.apiDateTime;

  get shortDate() {
    return !_.isEmpty(this.moment)
      ? this.moment.format(AdminConfig.format.date)
      : null;
  }
}

export class Collection {
  items: BaseType[] = [];
  meta?: {
    count: number;
    page: number;
    [name: string]: any;
    next: string;
    previous: string;
  };
}

export abstract class BaseType {
  public id: string | number = null;
  public createdBy: string = null;
  public createdDate = new DateMoment();
  public modifiedBy: string = null;
  public modifiedDate = new DateMoment();

  protected getFieldMap(extendedFieldMap: object = {}): object {
    return _.assign({}, BASE_FIELD_MAP, extendedFieldMap);
  }

  protected getFromDataFieldMap() {
    return _.chain(this.getFieldMap())
      .mapValues((field) => (_.isArray(field) ? field[0] : field))
      .value();
  }

  protected getToDataIgnoredFields(
    extendedIgnoreFields: Array<string> = []
  ): Array<string> {
    return _.concat([], BASE_IGNORE_FIELDS, extendedIgnoreFields);
  }

  fromData(data: object) {
    const fieldMap = _.invert(this.getFromDataFieldMap());

    _.forEach(data, (value: any, key: string) => {
      if (_.has(fieldMap, key)) {
        const modelField = fieldMap[key];
        if (_.endsWith(modelField, 'Date')) {
          value = new DateMoment().fromData(value);
        } else if (_.endsWith(modelField, 'Time')) {
          value = new TimeMoment().fromData(value);
        }
        if (typeof value === 'string') {
          value = _.trim(value, '\t');
        }
        _.set(this, modelField, value);
      }
    });

    return this;
  }

  toData(options?: string[]) {
    let fieldMap = _.omit(this.getFieldMap(), this.getToDataIgnoredFields());
    if (options) {
      fieldMap = _.pick(fieldMap, options);
    }

    const data: { [name: string]: any } = {};
    _.forEach(fieldMap, (dataField, modelField) => {
      let dataType: string;

      if (_.isArray(dataField)) {
        dataType = dataField[1];
        dataField = dataField[0];
      }

      let value = _.get(this, modelField);

      if (_.endsWith(modelField, 'Date') || _.endsWith(modelField, 'Time')) {
        if (value !== null) {
          value = value.toData();
        }
      } else if (_.isArray(value)) {
        if (_.isEmpty(value)) {
          if (dataType === 'string') {
            value = '';
          } else if (dataType === 'number' || dataType === 'object') {
            value = null;
          }
        }
      } else if (!_.isArray(value)) {
        if (value === null) {
          value = '';
        }
      }
      if (typeof value === 'string') {
        value = _.trim(value, '\t');
      }
      _.set(data, dataField, value);
    });

    const validatedData = {};
    _.forIn(data, (value, key) => {
      if (value !== '' && value !== null) {
        _.assign(validatedData, _.pick(data, key));
      }
    });
    return validatedData;
  }
}

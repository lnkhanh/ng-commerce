import { Component, OnInit, Input, Injectable, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { formatNumber } from '@angular/common';
import { AdminConfig } from '@app/core';

const numberDigitsInfo = '2.0-0';
const formatNumberOfTime = (no: number) => {
  const result = formatNumber(no, AdminConfig.locale, numberDigitsInfo);
  return result.length === 1 ? '0' + result : result;
}
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '/';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[1], 10),
        month : parseInt(date[0], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (!date) return '';
    const result = [
      formatNumberOfTime(date.month) || 0,
      formatNumberOfTime(date.day),
      date.year
    ];
    const value =  date ? result.join(this.DELIMITER) : null;
    return value;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[1], 10),
        month : parseInt(date[0], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }


  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const result = [
      formatNumberOfTime(date.month) || 0,
      formatNumberOfTime(date.day),
      date.year
    ];
    const value = date ? result.join(this.DELIMITER) : '';
    return value;
  }
}

@Component({
  selector: 'dashboard-custom-range-datetime',
  templateUrl: './custom-range-datetime.component.html',
  styleUrls: ['./custom-range-datetime.component.scss'],

  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will want to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class CustomRangeDatetimeComponent implements OnInit, OnChanges, AfterViewInit {
  @Input("fromDate") inputFromDate: string;
  @Input("toDate") inputToDate: string;
  @Output() onApply: EventEmitter<{ fromDate: string, toDate: string }> = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  public hoveredDate: NgbDate | null = null;

  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;

  public adminConfig = AdminConfig;

  public isDateValid = true;

  constructor(
    private _calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
  }

  ngOnInit() {
    // this.initDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initDate();
  }

  ngAfterViewInit() {
    this.initDate();
  }

  handleOnApply() {
    if (!this.toDate) {
      this.toDate = this.fromDate;
    }
    const result: any = {
      fromDate: moment()
        .year(this.fromDate.year)
        .month(this.fromDate.month - 1)
        .date(this.fromDate.day)
        .format(),
      toDate: moment()
        .year(this.toDate.year)
        .month(this.toDate.month -1)
        .date(this.toDate.day)
        .format()
    };
    this.onApply.emit(result);
  }

  handleOnCancel() {
    this.onCancel.emit();
  }

  initDate() {
    const momentFromDate = moment(this.inputFromDate, moment.ISO_8601);
    const momentToDate = moment(this.inputToDate, moment.ISO_8601);

    this.fromDate = new NgbDate(momentFromDate.year(), momentFromDate.month() + 1, momentFromDate.date());
    this.toDate = new NgbDate(momentToDate.year(), momentToDate.month() + 1, momentToDate.date());
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.isDateValid = this.checkDateValid();
  }

  isHovered(date: NgbDate) {
    return this.fromDate
      && !this.toDate
      && this.hoveredDate
      && date.after(this.fromDate)
      && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate
      && date.after(this.fromDate)
      && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate)
      || (this.toDate && date.equals(this.toDate))
      || this.isInside(date)
      || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    const result = parsed && this._calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    return result;
  }

  handleDateOnChange() {
    this.isDateValid = this.checkDateValid();
  }

  private checkDateValid() {
    if (!this._calendar.isValid(this.fromDate)) {
      return false;
    }
    if (!this._calendar.isValid(this.fromDate)) {
      this.isDateValid = false;
      return false;
    }
    if (this.fromDate && this.fromDate.year.toString().length < 4) {
      return false;
    }
    if (this.toDate && this.toDate.year.toString().length < 4) {
      return false;
    }
    return true;
  }

}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dashboard-statistics',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
})
export class Statistics {
  @Input() title: string;
  @Input() value: string;
  @Input() icon: string;
  @Input() backgroundColor: string;
  @Input() borderColor: string;
  @Output() onViewMore = new EventEmitter();

  handleOnViewMore(event) {
    event.preventDefault();
    event.stopPropagation();
    this.onViewMore.emit();
  }
}

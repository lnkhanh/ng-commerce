import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'lodash';
import { PaginatorModel } from '@core/models/common';

@Component({
  selector: "ecom-list",
  templateUrl: "./index.html",
  styleUrls: ["./index.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EcomList implements OnInit {
  @Input() dataSource: any[];
  @Input() columns: any[];
  @Input() paginator: PaginatorModel;
  @Input() renderCellContent: Function;
  @Input() emptyMessage: string;
  @Input() loading: boolean;
  @Output() event = new EventEmitter();
  public headerColumns: string[];
  public definedColumns: any[];

  constructor(private _router: Router) {}

  ngOnInit() {
    this.definedColumns = this.columns;
    this.headerColumns = map(this.definedColumns, 'field');
  }

  getCellValue(column, element, index) {
    const rowIndex = this.getRowIndex(index);
    const data = {
      ...element,
      Index: rowIndex,
    }
    if (this.renderCellContent) {
      return this.renderCellContent(column, data);
    }

    return column.value(data);
  }

  getRowIndex(index) {
    if (this.loading) {
      return '--';
    }

    let result = index;
    if (!this.paginator || !this.paginator.pageIndex || !this.paginator.pageSize) {
      return index + 1;
    }

    const { pageIndex, pageSize } = this.paginator;
    result = (pageSize * (pageIndex - 1)) + index + 1;

    return result;
  }

  @HostListener("click", ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLAnchorElement === false) {
      return this.event.emit(event);
    }

    const target = <HTMLAnchorElement>event.target;
    this._router.navigate([target.pathname]);
  }
}

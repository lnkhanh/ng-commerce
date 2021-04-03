import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutUtilsService } from '@app/core/views/crud';
import { ComposeTableDialogComponent } from '@app/modules/e-commerce/components/compose-table-dialog/compose-table-dialog.component';
import { StoreTableDataSource } from '@app/modules/e-commerce/_data-sources/store.datasource';
import { StoreTableType } from '@app/modules/e-commerce/_models/store.model';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'ng-com-store-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class StoreTableComponent implements OnInit {
  @Input() dataSource: StoreTableDataSource;
  @Input() storeId: string;
  @Output() handlePagination = new EventEmitter();
  @Output() handleRemoveTable = new EventEmitter();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  // Table fields
  public displayedColumns = [
    'name',
    'modifiedAt',
    'createdAt',
    'actions',
  ];
  public pageSizeOptions = [10, 15, 20];
  public pageEvent;

  private destroy$: Subject<boolean>;

  private filter: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
  };
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _layoutUtilsService: LayoutUtilsService,
    private _router: Router,
    private _dialog: MatDialog,
  ) {
    this.destroy$ = new Subject();
    this.filter = {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
    };
  }

  ngOnInit() {
    this.init();
    this.searchSub();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  init() {
    this.handlePagination.emit(this.filter);
  }

  onClearSearch() {
    this.searchInput.nativeElement.value = '';
    this.filter.keyword = '';
    this.filter.pageIndex = 1;

    const queryParams = {
      pageIndex: 0,
      pageSize: this.filter.pageSize,
      keyword: "",
    };
    this.getPaginatorData(queryParams);
  }

  getPaginatorData(event) {
    const queryParams = {
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize,
      keyword: this.filter.keyword,
    };

    this.handlePagination.emit(queryParams);

    return event;
  }

  onOpenNewTableDialog() {
    if (!this.storeId) {
      return;
    }
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      storeId: this.storeId
    };

    const dialogRef = this._dialog.open(
      ComposeTableDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((rs) => { });
  }

  onRemoveTable(table: StoreTableType) {
    const title = 'Remove table';
    const description = `Are you sure you want to remove table ${table.name}?`;
    const waitDescription = 'Removing....';
    const dialogRef = this._layoutUtilsService.confirmElement(
      title,
      description,
      waitDescription
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.handleRemoveTable.emit(table.id);
    });
  }

  onEditTable(table: StoreTableType) {
    if (!table || !this.storeId) {
      return;
    }
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      table,
      storeId: this.storeId
    };

    const dialogRef = this._dialog.open(
      ComposeTableDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((rs) => { });
  }

  private searchSub() {
    fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(50),
        distinctUntilChanged(),
        tap((event: any) => {
          if (event.keyCode === 13) {
            this.filter.keyword = this.searchInput.nativeElement.value;
            this.getPaginatorData({
              pageIndex: 0,
              pageSize: this.filter.pageSize,
              keyword: this.filter.keyword
            });
          }
        })
      )
      .subscribe();
  }
}

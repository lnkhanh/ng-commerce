import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@core/reducers';
import { LayoutUtilsService } from '@core/views/crud';
import { StoreDataSource } from '@app/modules/e-commerce/_data-sources/store.datasource';
import {
  ArchiveStoreAction,
  FetchStoreListAction,
  SaveRequestParamsAction,
} from '@app/modules/e-commerce/_actions/store.actions';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { AddNewStoreDialogComponent } from '../add-new-store-dialog/add-new-store-dialog.component';
import { RequestParamModel } from '@app/core/models/common';
import { SubheaderService } from '@app/core/views/layout';

@Component({
  selector: 'ng-com-stores-list',
  templateUrl: './store-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  // Table fields
  public dataSource: StoreDataSource;
  public displayedColumns = [
    'name',
    'address',
    'modifiedAt',
    'createdAt',
    'actions',
  ];
  public pageSizeOptions = [10, 15, 20];
  public pageEvent;

  private filter: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
  };
  private subscriptions: Subscription[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _store: Store<AppState>,
    private _router: Router,
    private _layoutUtilsService: LayoutUtilsService,
    private _dialog: MatDialog,
    private _subheaderService: SubheaderService,
  ) {
    this.filter = {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
    };
  }

  ngOnInit() {
    this._subheaderService.setBreadcrumbs([
      { title: 'eCommerce', page: `/ecommerce/stores` },
      { title: 'Stores', page: `/ecommerce/stores` }
    ]);
    this.dataSource = new StoreDataSource(this._store);
    this.init();
    this.searchSub();
  }

  ngOnDestroy() { }

  init() {
    // Init paginator
    this._activatedRoute.queryParams.subscribe(
      (params: { page: number; pageSize: number; keyword: string }) => {
        if (params.page) {
          this.paginator.pageIndex = params.page;
          this.filter.pageIndex = +params.page + 1;
        }

        if (params.pageSize) {
          this.paginator.pageSize = params.pageSize;
          this.filter.pageSize = +params.pageSize;
        }

        if (params.keyword) {
          this.searchInput.nativeElement.value = params.keyword;
          this.filter.keyword = params.keyword;
        }

        const searchParams: RequestParamModel = {
          pageIndex: this.filter.pageIndex,
          pageSize: this.filter.pageSize,
          keyword: params.keyword || '',
        };

        this._store.dispatch(
          new SaveRequestParamsAction({ params: searchParams })
        );
        this._fetchList();
      }
    );
  }

  getPaginatorData(event) {
    this._router.navigate([location.pathname], {
      queryParams: {
        page: event.pageIndex,
        pageSize: event.pageSize,
        keyword: this.filter.keyword,
      },
    });

    return event;
  }

  onOpenNewStoreDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';

    const dialogRef = this._dialog.open(
      AddNewStoreDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((rs) => {
      console.log(rs);
      if (rs.shouldReload && rs.storeId) {
        this.onEditStore(rs.storeId);
      }
    });
  }

  onDeleteStore(store: StoreType) {
    const title = 'Remove store';
    const description = `Are you sure you want to remove store ${Store.name}?`;
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

      this._store.dispatch(new ArchiveStoreAction({ storeId: store.id }));
    });
  }

  onEditStore(id) {
    this._router.navigate(['../stores/edit', id], {
      relativeTo: this._activatedRoute,
    });
  }

  private searchSub() {
    const searchSubscription = fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    )
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        tap((event: any) => {
          if (event.keyCode === 13) {
            this.searchEvent();
          }
        })
      )
      .subscribe();
    this.subscriptions.push(searchSubscription);
  }

  private searchEvent() {
    this._router.navigate([location.pathname], {
      queryParams: {
        page: 0,
        pageSize: this.filter.pageSize,
        keyword: this.searchInput.nativeElement.value,
      },
    });
  }

  private _fetchList() {
    return this._store.dispatch(new FetchStoreListAction());
  }
}

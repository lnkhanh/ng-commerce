import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@core/reducers';
import { LayoutUtilsService } from '@core/views/crud';
import { OrderDataSource } from '@app/modules/e-commerce/_data-sources/order.datasource';
import {
  ArchiveOrderAction,
  FetchOrderListAction,
  SaveRequestParamsAction,
} from '@app/modules/e-commerce/_actions/order.actions';
import { OrderStatuses, OrderStatusOptions, OrderType } from '@app/modules/e-commerce/_models/order.model';
import { RequestParamModel } from '@app/core/models/common';
import { find } from 'lodash';
import { SubheaderService } from '@app/core/views/layout';

@Component({
  selector: 'kt-orders-list',
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  // Table fields
  public dataSource: OrderDataSource;
  public displayedColumns = [
    'code',
    'status',
    'customer',
    'name',
    'phone',
    'email',
    'createdDate',
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
      { title: 'eCommerce', page: `/ecommerce/orders` },
      { title: 'Orders', page: `/ecommerce/orders` },
    ]);
    this.dataSource = new OrderDataSource(this._store);
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

  onViewOrder(orderId: string) {
    this._router.navigate([`../orders/view/${orderId}`], {
      relativeTo: this._activatedRoute,
    });
  }

  onArchiveOrder(order: OrderType) {
    if (!order || !this.canArchiveOrder(order.status)) {
      return;
    }

    const title = 'Remove Order';
    const description = `Are you sure you want to remove order ${order.id}?`;
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

      this._store.dispatch(new ArchiveOrderAction({ orderId: order.id }));
    });
  }

  canArchiveOrder(status: number) {
    return OrderStatuses.Completed !== status;
  }

  getOrderStatusName(status: number) {
    const found = find(OrderStatusOptions, { val: status });
    return found ? found.name : 'Unknown';
  }

  getOrderStatusCls(status: number) {
    if (OrderStatuses.Completed === status) return 'badge-success';
    return 'badge-warning';
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
    return this._store.dispatch(new FetchOrderListAction());
  }
}

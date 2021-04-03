import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/reducers';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { SubheaderService } from '@app/core/views/layout';
import { FetchOrderDetailsAction, UpdateOrderStatusAction } from '@app/modules/e-commerce/_actions/order.actions';
import { OrderType, OrderStatusOptions } from '@app/modules/e-commerce/_models/order.model';
import { selectCurrentOrder } from '@app/modules/e-commerce/_selectors/order.selectors';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { skipWhile, takeUntil } from 'rxjs/operators';
import find from 'lodash/find';


@Component({
  selector: 'ng-com-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit, OnDestroy {
  public orderId: string;
  public order$: Observable<OrderType>;
  public loading$: Observable<boolean>;

  public title: string;

  private destroy$: Subject<void>;

  constructor(
    private _route: ActivatedRoute,
    private _subheaderService: SubheaderService,
    private _store: Store<AppState>,
    private _location: Location
  ) { 
    this.orderId = this._route.snapshot.paramMap.get('id');
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    if (!this.orderId) {
      this.onBack();
    }

    this.fetchDetails();
    this.order$ = this._store.pipe(select(selectCurrentOrder()));
    this.loading$ = this._store.pipe(select(selectPageLoading));
    this.order$.pipe(
      skipWhile((isNull) => !isNull),
      takeUntil(this.destroy$)
    ).subscribe((order) => {
      if (order) {
        this.title = `Order #${order.code}`;
        this._subheaderService.setBreadcrumbs([
          { title: 'eCommerce', page: `/ecommerce/orders` },
          { title: 'Orders', page: `/ecommerce/orders` },
          { title: `Order #${order.code}`, page: `` },
        ]);
      } else {
        this.onBack();
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBack() {
    this._location.back();
  }
  
  getOrderStatusName(status: number) {
    const found = find(OrderStatusOptions, { val: status });
    return found ? found.name : 'Unknown';
  }

  onUpdateOrderStatus(status: number) {
    this._store.dispatch(new UpdateOrderStatusAction({ orderId: this.orderId, status }));
  }

  private fetchDetails() {
    return this._store.dispatch(
      new FetchOrderDetailsAction({ orderId: this.orderId })
    );
  }
}

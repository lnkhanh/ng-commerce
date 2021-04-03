import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppState } from '@app/core/reducers';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { LayoutUtilsService } from '@app/core/views/crud';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import { ChangeOrderStatusAction, FetchOrderDetailsAction, UpdateOrderItemQuantityAction } from '../../_actions/order.actions';
import { UpdateCartItemQuantityAction } from '../../_actions/pos.actions';
import { OrderedProduct, OrderDetails } from '../../_models/pos.model';
import { selectCurrentOrder } from '../../_selectors/order.selectors';

@Component({
  selector: 'order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent implements OnInit, OnDestroy {
  public orderId: string;
  public loading$: Observable<boolean>;
  public order$: Observable<OrderDetails>;

  private destroy$: Subject<boolean>;

  constructor(private _store: Store<AppState>,
    private _layoutUtilsService: LayoutUtilsService,
    private _dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
    private _toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) private _orderId: string) {

    this.loading$ = this._store.pipe(select(selectPageLoading));
    this.order$ = this._store.pipe(select(selectCurrentOrder()));
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    if (this._orderId) {
      this.orderId = this._orderId;
      this._fetchOrderDetails();
    }

    this.order$.pipe(
      takeUntil(this.destroy$),
      skip(1)
    ).subscribe((order) => {
      // Item has been removed
      if (!order) {
        this._toastService.showDanger('This order has been removed.');
        this._dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onUpdateStatus(status: number) {
    this._store.dispatch(new ChangeOrderStatusAction({ orderId: this.orderId, status, reloadDetail: true }));
  }

  onRemoveOrderItem(item: OrderedProduct) {
    const title = 'Remove item';
    const description = `Are you sure you want to remove this item?`;
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

      this._store.dispatch(new UpdateOrderItemQuantityAction({ orderId: this.orderId, itemId: item.productId, quantity: 0, note: '' }));
    });
  }

  onUpdateQuantity(item: OrderedProduct) {
    this._store.dispatch(new UpdateOrderItemQuantityAction({ orderId: this.orderId, itemId: item.productId, quantity: item.quantity, note: item.note }));
  }

  private _fetchOrderDetails() {
    if (!this.orderId) {
      return;
    }

    return this._store.dispatch(new FetchOrderDetailsAction({ orderId: this.orderId }));
  }
}

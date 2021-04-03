import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import { OrderStatuses, OrderType, OrderedItemType } from '@app/modules/e-commerce/_models/order.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'list-order-item',
  templateUrl: './list-order-item.component.html',
  styleUrls: ['./list-order-item.component.scss']
})
export class ListOrderItemComponent implements OnInit, OnDestroy {
  @Input() order$: Observable<OrderType>;
  @Input() loading$: Observable<boolean>;

  public locked$: BehaviorSubject<boolean>;
  public isEmptyOrder: boolean;
  public editable: boolean;

  private _notAllowedStatuses: OrderStatuses[];
  private destroy$: Subject<boolean>;

  constructor(private _toastService: ToastService) {
    this.isEmptyOrder = false;
    this.editable = true;
    this.locked$ = new BehaviorSubject<boolean>(true);
    this._notAllowedStatuses = [OrderStatuses.Completed, OrderStatuses.Cancelled];
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    this._subscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private _subscriptions() {
    this.order$.pipe(takeUntil(this.destroy$)).subscribe((order) => {
      this.isEmptyOrder = !order || !order.products || !order.products.length;

      if (order) {
        this.editable = this._notAllowedStatuses.includes(order.status) === false;
      }
    });

    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((isLoading) => {
      this.locked$.next(isLoading || !this.editable);
    });
  }
}

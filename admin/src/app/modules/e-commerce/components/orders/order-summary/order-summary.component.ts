import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayoutUtilsService } from '@app/core/views/crud';
import { OrderStatuses, OrderStatusOptions, OrderType } from '@app/modules/e-commerce/_models/order.model';
import { Observable } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {
  @Input() order$: Observable<OrderType>;
  @Input() loading$: Observable<boolean>;
  @Output() handleUpdateOrderStatus = new EventEmitter();

  public order: OrderType;
  public orderStatues = OrderStatusOptions;
    
  constructor(private _layoutUtilsService: LayoutUtilsService) { }

  ngOnInit(): void {
    this.order$.subscribe((order) => {
      if (order) {
        this.order = cloneDeep(order);
      }
    });
  }

  onChangeStatus(status: number) {
    if (+status !== OrderStatuses.Cancelled) {
      return this.handleUpdateOrderStatus.emit(status);
    }

    const title = 'Cancel order';
    const description = `Are you sure you want to cancel this order?`;
    const waitDescription = 'Cancelling....';
    const btnLb = 'Ok';
    const dialogRef = this._layoutUtilsService.confirmElement(
      title,
      description,
      waitDescription,
      btnLb
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.handleUpdateOrderStatus.emit(status);
    });
  }
}

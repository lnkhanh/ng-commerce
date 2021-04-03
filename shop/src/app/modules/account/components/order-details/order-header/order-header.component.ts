import { Component, Input, OnInit } from '@angular/core';
import { OrderType, OrderStatuses, OrderStatusNames } from '@app/modules/home/_models/order.model';

@Component({
  selector: 'order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.css']
})
export class OrderHeaderComponent implements OnInit {
  @Input() order: OrderType;

  public orderStatuses = OrderStatusNames;

  constructor() { }

  ngOnInit(): void {
    console.log(this.order);
  }

  getOrderState(statusName: string) {
    const orderStatusEnum = this.order.status;

    const newOrderStt = [OrderStatusNames[OrderStatuses.New], OrderStatusNames[OrderStatuses.Preparing]];

    // New Order
    if (newOrderStt.includes(statusName) && (orderStatusEnum === OrderStatuses.New || orderStatusEnum === OrderStatuses.Preparing)) {
      return true;
    }

    // Order on Shipping
    if (statusName === OrderStatusNames[OrderStatuses.Shipping]&& orderStatusEnum === OrderStatuses.Shipping) {
      return true;
    }

    // Order on Ready
    if (statusName === OrderStatusNames[OrderStatuses.Ready]&& orderStatusEnum === OrderStatuses.Ready) {
      return true;
    }

    // Order on Completed
    if (statusName === OrderStatusNames[OrderStatuses.Completed] && orderStatusEnum === OrderStatuses.Completed) {
      return true;
    }

    // Order on Cancelled
    if (statusName === OrderStatusNames[OrderStatuses.Cancelled] && orderStatusEnum === OrderStatuses.Cancelled) {
      return true;
    }

    return false;
  }
}

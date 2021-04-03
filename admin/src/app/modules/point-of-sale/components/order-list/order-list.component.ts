import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayoutUtilsService } from '@app/core/views/crud';
import { OrderStatusNames, OrderStatusOptions } from '@app/modules/e-commerce/_models/order.model';
import { PosOrderDataSource } from '../../_data-sources/order.datasource';
import { OrderType } from '../../_models/pos.model';

@Component({
  selector: 'pos-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  @Input() dataSource: PosOrderDataSource;
  @Input() displayedColumns: string[];
  @Input() showFull = false;
  @Output() handlePagination = new EventEmitter();
  @Output() handleShowFullscreen = new EventEmitter();
  @Output() handleRemove = new EventEmitter();
  @Output() handleChangeStatus = new EventEmitter();
  @Output() handleEdit = new EventEmitter();

  public pageSizeOptions = [10, 15, 20];
  public pageEvent;
  public orderStatuses;

  constructor(private _layoutUtilsService: LayoutUtilsService) {
    this.orderStatuses = OrderStatusOptions;
  }

  ngOnInit(): void { }

  getPaginatorData(event) {
    const filter = {
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize
    };
    this.handlePagination.emit(filter);

    return event;
  }

  onShowFullscreen() {
    this.handleShowFullscreen.emit();
  }

  onEditOrder(order: OrderType) {
    this.handleEdit.emit(order);
  }

  onChangeOrderStatus(selected, orderId: string) {
    this.handleChangeStatus.emit({ orderId, status: selected.value });
  }

  onRemoveOrder(order: OrderType) {
    const title = 'Remove order';
    const description = `Are you sure you want to remove this order?`;
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

      this.handleRemove.emit(order);
    });
  }

  getOrderStatusName(orderSttEnum: number) {
    if (OrderStatusNames[orderSttEnum]) {
      return OrderStatusNames[orderSttEnum];
    }
    return '--';
  }
}

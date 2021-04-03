import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestParamModel } from '@app/core/models/common';
import { AppState } from '@app/core/reducers';
import { OrderType } from '@app/modules/e-commerce';
import { Store } from '@ngrx/store';
import { ChangeOrderStatusAction, FetchOrderListAction, RemoveOrderAction, SaveRequestParamsAction } from '../../_actions/order.actions';
import { PosOrderDataSource } from '../../_data-sources/order.datasource';
import { OrderDetailsDialogComponent } from '../order-details-dialog/order-details-dialog.component';

@Component({
  selector: 'order-list-dialog',
  templateUrl: './order-list-dialog.component.html',
  styleUrls: ['./order-list-dialog.component.scss']
})
export class OrderListDialogComponent implements OnInit {
  public orderDataSource: PosOrderDataSource;
  public orderListColumns = [
    'store',
    'table',
    'phone',
    'status',
    'userFullName',
    'email',
    'orderDate',
    'actions',
  ];

  constructor(
    private _dialog: MatDialog,
    private _store: Store<AppState>
  ) {
    this.orderDataSource = new PosOrderDataSource(this._store);
  }

  ngOnInit(): void {
  }

  onOrderPagination(filter) {
    const params: RequestParamModel = {
      pageIndex: filter.pageIndex,
      pageSize: filter.pageSize,
      keyword: ''
    };

    this._store.dispatch(new SaveRequestParamsAction({ params }));
    this._fetchOrders();
  }

  onChangeOrderStatus(data: { orderId: string, status: number }) {
    this._store.dispatch(new ChangeOrderStatusAction({ orderId: data.orderId, status: data.status, reloadList: true }));
  }

  onEditOrder(order: OrderType) {
    if (!order) {
      return;
    }

    const dialogRef = this._dialog.open(OrderDetailsDialogComponent, {
      panelClass: ['full-width-dialog', 'kt-mat-dialog-container__wrapper'],
      data: order.id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onRemoveOrder(order: OrderType) {
    if (!order) {
      return;
    }

    this._store.dispatch(new RemoveOrderAction({ orderId: order.id }));
  }

  private _fetchOrders() {
    return this._store.dispatch(new FetchOrderListAction());
  }
}

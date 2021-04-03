import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import { OrderStatuses } from '@app/modules/e-commerce/_models/order.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderDetails, OrderedProduct } from '../../_models/pos.model';
import { ComposeItemNoteDialogComponent } from '../compose-item-note-dialog/compose-item-note-dialog.component';

@Component({
  selector: 'list-items-order-details',
  templateUrl: './list-items-order-details.component.html',
  styleUrls: ['./list-items-order-details.component.scss']
})
export class ListItemsOrderDetailsComponent implements OnInit, OnDestroy {
  @Input() order$: Observable<OrderDetails>;
  @Input() loading$: Observable<boolean>;
  @Output() handleUpdateQuantity = new EventEmitter();
  @Output() handleRemoveItem = new EventEmitter();

  public locked$: BehaviorSubject<boolean>;
  public isEmptyOrder: boolean;
  public editable: boolean;

  private _notAllowedStatuses: OrderStatuses[];
  private destroy$: Subject<boolean>;

  constructor(
    private _toastService: ToastService,
    private _dialog: MatDialog,
    ) {
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

  onUpdateQuantity(qtyObj: { qty: number }, item: OrderedProduct) {
    if (!this.editable) {
      this._toastService.showDanger('The current status not allowed to update.');
      return;
    }

    const newItem = { ...item, quantity: qtyObj.qty };
    this.handleUpdateQuantity.emit(newItem);
  }

  async onOpenComposeItemNoteDialog(item: OrderedProduct) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.data = {
      title: item.title,
      note: item.note
    };

    const dialogRef = this._dialog.open(
      ComposeItemNoteDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((rs) => {
      if (rs) {
        this.handleUpdateQuantity.emit({...item, note: rs.note});
      }
    });
  }

  onRemoveItem(item: OrderedProduct) {
    if (!this.editable) {
      return;
    }

    this.handleRemoveItem.emit(item);
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

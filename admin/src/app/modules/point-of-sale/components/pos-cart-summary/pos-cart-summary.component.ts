import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RequestParamModel } from '@app/core/models/common';
import { CustomerModel, CustomerService } from '@app/modules/e-commerce';
import { StoreTableType } from '@app/modules/e-commerce/_models/store.model';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { CartItemType, CartType } from '../../_models/pos.model';
import { ComposeItemNoteDialogComponent } from '../compose-item-note-dialog/compose-item-note-dialog.component';

@Component({
  selector: 'pos-cart-summary',
  templateUrl: './pos-cart-summary.component.html',
  styleUrls: ['./pos-cart-summary.component.scss'],
  providers: [CustomerService]
})
export class PosCartSummaryComponent implements OnInit, OnDestroy {
  @Input() cart$: Observable<CartType>;
  @Input() loading$: Observable<boolean>;
  @Input() tables$: Observable<StoreTableType[]>;
  @Input() currentTable: StoreTableType;
  @Output() handleChangeTable = new EventEmitter();
  @Output() handleUpdateQuantity = new EventEmitter();
  @Output() handleRemoveItem = new EventEmitter();
  @Output() handleCheckout = new EventEmitter();

  public isEmptyCart: boolean;
  public currentTableId: string;
  public orderNote: string;
  // Customer autocomplete
  public selectedCustomer: CustomerModel;
  public searchCustomer;
  public customerFormatter;

  private destroy$: Subject<boolean>;

  constructor(
    private _dialog: MatDialog,
    private _customerService: CustomerService
  ) {
    this._searchCustomer();
    this.isEmptyCart = false;
    this.orderNote = '';
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    this.cart$.pipe(takeUntil(this.destroy$)).subscribe((cart) => {
      this.isEmptyCart = !cart || !cart.items || !cart.items.length;
    });

    if (this.currentTable) {
      this.currentTableId = this.currentTable.id;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onUpdateQuantity(qtyObj: { qty: number }, item: CartItemType) {
    const newItem = { ...item, quantity: qtyObj.qty };
    this.handleUpdateQuantity.emit(newItem);
  }

  onRemoveItem(item: CartItemType) {
    this.handleRemoveItem.emit(item);
  }

  onChangeTable(table: StoreTableType) {
    this.handleChangeTable.emit({ ...table });
  }

  async onCheckout() {
    const cart = await this.cart$.pipe(take(1)).toPromise();
    if (!cart.items || !cart.items.length || this.isEmptyCart) {
      return;
    }
    this.handleCheckout.emit({ note: this.orderNote, customer: this.selectedCustomer });
    this.orderNote = '';
    this.selectedCustomer = null;
  }

  async onOpenComposeItemNoteDialog(item: CartItemType) {
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
        this.handleUpdateQuantity.emit({ ...item, note: rs.note });
      }
    });
  }

  get isSelectedCustomer() {
    if (!this.selectedCustomer || !this.selectedCustomer.id) {
      return false;
    }
    
    return true;
  }

  private _searchCustomer() {
    this.searchCustomer = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        switchMap((kw) => this._searchCustomers(kw))
      );

    this.customerFormatter = (cus: CustomerModel) => `${cus.firstName} ${cus.lastName}`;
  }

  private _searchCustomers(keyword: string) {
    const searchParams: RequestParamModel = {
      pageIndex: 1,
      pageSize: 10,
      keyword: keyword,
    };

    return this._customerService.fetchCustomerList(searchParams).pipe(
      map((rs) => {
        if (!rs || !rs.data || !rs.data.records) {
          return [];
        }

        return rs.data.records;
      })
    );
  }
}

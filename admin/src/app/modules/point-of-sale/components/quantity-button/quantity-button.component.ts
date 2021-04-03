import { Component, OnInit, Input, Output, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { LayoutUtilsService } from '@app/core/views/crud';
import { Subject, BehaviorSubject, Subscription, Observable } from 'rxjs';
import { buffer, debounceTime } from 'rxjs/operators';

const BUTTON_DEBOUNCE_TIME = 300; // TODO

@Component({
  selector: 'quantity-button',
  templateUrl: './quantity-button.component.html',
  styleUrls: ['./quantity-button.component.scss'],
})
export class QuantityButtonComponent implements OnInit, OnDestroy {
  @Input() quantity = 0;
  @Input() addBtnTxt = 'ADD';
  @Input() customCls = '';
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() isLocked$: Observable<boolean>;
  @Input() removeConfirmHeader = 'Remove Item';
  @Input() removeConfirmMessage = 'Are you sure?';
  @Output() quantityChange = new EventEmitter();

  public displayRemoveBtn: boolean;
  public isLocked: boolean;

  private updateProductSubject;
  private debounceUpdateProduct$;
  private updateProduct$;
  private subscriptions: Subscription[];

  constructor(
    private _layoutUtilsService: LayoutUtilsService,
    private zone: NgZone) {
    this.updateProductSubject = new Subject();
    this.subscriptions = [];
    this.isLocked = false;
    this.debounceUpdateProduct$ = this.updateProductSubject.pipe(
      debounceTime(BUTTON_DEBOUNCE_TIME)
    );
    this.updateProduct$ = this.updateProductSubject.pipe(
      buffer(this.debounceUpdateProduct$)
    );
  }

  ngOnInit() {
    this.displayRemoveBtn = this.quantity === 1;
    // Compose and dispatch last event
    this.updateProduct$.subscribe((listQty: number[]) => {
      if (listQty && listQty.length) {
        this.isLocked = true;
        const lastQty = listQty[listQty.length - 1];
        this.quantityChange.emit({ qty: lastQty });
      }
    });

    this.init();
  }

  init() {
    const lockSubscription = this.isLocked$.subscribe((isLocked) => {
      this.isLocked = isLocked;
    });

    this.subscriptions.push(lockSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(u => u.unsubscribe && u.unsubscribe());
  }

  onDecrease() {
    if (this.isLocked === true) {
      return;
    }
    this.quantity -= 1;
    if (this.quantity - 1 === 0) {
      this.isLocked = true;

      // Prevent the user continue on pressing on remove button
      setTimeout(() => {
        this.displayRemoveBtn = true;
        this.isLocked = false;
      });
    }

    this.onChange();
  }

  onIncrease() {
    if (this.isLocked === true) {
      return;
    }

    this.displayRemoveBtn = false;
    this.quantity += 1;
    this.onChange();
  }

  onAdd() {
    // Lock at first
    this.isLocked = true;

    this.quantity = 1;
    this.onChange();
  }

  onChange() {
    this.updateProduct$.next(this.quantity);
  }

  onRemove() {
    if (this.isLocked === true) {
      return;
    }

    const title = 'Remove item';
    const description = `Are you sure you want to remove this item?`;
    const waitDesciption = 'Removing....';
    const dialogRef = this._layoutUtilsService.confirmElement(
      title,
      description,
      waitDesciption
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.zone.run(() => {
        this.quantity = 0;
        this.quantityChange.emit({ qty: 0 });
      });
    });
  }
}

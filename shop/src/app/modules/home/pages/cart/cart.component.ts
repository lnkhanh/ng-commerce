import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@app/shared/reducers';
import { selectCart } from '@app/shared/selectors/base.selectors';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { ComposeCartItemNoteComponent } from '../../components/compose-cart-item-note/compose-cart-item-note.component';
import { RemoveCartItemAction, UpdateCartItemQuantityAction } from '../../_actions/cart.actions';
import { CartItemType, CartType } from '../../_models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  public cart$: Observable<CartType>;

  private destroy$: Subject<void>;

  constructor(private _store: Store<AppState>, private _modalService: NgbModal) { 
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    this.cart$ = this._store.pipe(select(selectCart()));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChangeQuantity(item: CartItemType, quantity: number) {
    this._store.dispatch(new UpdateCartItemQuantityAction({ itemId: item.id, quantity, note: item.note }));
  }

  onRemoveFromCart(item: CartItemType) {
    this._store.dispatch(new RemoveCartItemAction({ itemId: item.id }));
  }

  onOpenNoteModal(item: CartItemType) {
    const noteModal = this._modalService.open(ComposeCartItemNoteComponent, { size: 'sm', centered: true });
    noteModal.componentInstance.data = {
      title: item.title,
      note: item.note
    };
    noteModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      if (receivedEntry) {
        this._store.dispatch(new UpdateCartItemQuantityAction({ itemId: item.id, quantity: item.quantity, note: receivedEntry.note }));
      }
    });
  }
}

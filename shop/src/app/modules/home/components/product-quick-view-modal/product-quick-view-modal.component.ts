import { Component, Input, OnInit } from '@angular/core';
import { AppState } from '@app/shared/reducers';
import { selectCategoryList } from '@app/shared/selectors/base.selectors';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddCartItemAction } from '../../_actions/cart.actions';
import { AddCartItemData } from '../../_models/cart.model';
import { CategoryType } from '../../_models/category.model';
import { ProductType } from '../../_models/product.model';

@Component({
  selector: 'app-product-quick-view-modal',
  templateUrl: './product-quick-view-modal.component.html',
  styleUrls: ['./product-quick-view-modal.component.scss']
})
export class ProductQuickViewModalComponent implements OnInit {
  @Input() product: ProductType;
  public quantity: number;
  public category: CategoryType;

  private destroy$: Subject<void>;

  constructor(public activeModal: NgbActiveModal, private _store: Store<AppState>) {
    this.destroy$ = new Subject();
    this.quantity = 1;
  }

  ngOnInit(): void {
    this._selectData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeQuantity($event) {
    this.quantity = $event;
  }

  addToCart() {
    const data: AddCartItemData = {
      productId: this.product.id,
      quantity: this.quantity
    };

    this._store.dispatch(new AddCartItemAction({ data }));
  }

  private _selectData() {
    this._store.pipe(
      takeUntil(this.destroy$),
      select(selectCategoryList()))
      .subscribe((categories) => {
        if (categories) {
          this.category = categories.find((cat) => cat.id === this.product.categoryId);
        }
      });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/shared/reducers';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddCartItemAction } from '../../_actions/cart.actions';
import { FetchProductDetailsAction } from '../../_actions/home.actions';
import { CategoryType } from '../../_models/category.model';
import { ProductType, } from '../../_models/product.model';
import { AddCartItemData } from '../../_models/cart.model';
import { selectProductDetails } from '../../_selectors/home.selector';
import { selectCategoryList } from '@app/shared/selectors/base.selectors';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  public product: ProductType;
  public quantity: number;
  public category: CategoryType;

  private destroy$: Subject<void>;

  constructor(private _store: Store<AppState>, private _route: ActivatedRoute) {
    const slug = this._route.snapshot.paramMap.get('slug');
    this.destroy$ = new Subject();
    this.quantity = 1;
    this._fetchProductDetails(slug);
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
    combineLatest([
      this._store.pipe(select(selectProductDetails())),
      this._store.pipe(select(selectCategoryList()))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([product, categories]) => {
      if (product) {
        this.product = product;

        if (categories) {
          this.category = categories.find((cat) => cat.id === product.categoryId);
        }
      }
    });
  }

  private _fetchProductDetails(slug: string) {
    const productId = slug.split('-').pop(); // Get last element
    return this._store.dispatch(new FetchProductDetailsAction(productId));
  }
}

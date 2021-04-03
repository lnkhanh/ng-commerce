import { Component, OnInit } from '@angular/core';
import { PaginatorModel } from '@app/shared/models/common';
import { AppState } from '@app/shared/reducers';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { selectLoading } from '@app/shared/selectors/loading.selectors';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeActionTypes, SaveProductFilterAction, SaveSearchProductsCriteriaAction, SearchProductsAction } from '../../_actions/home.actions';
import { AddCartItemAction } from '../../_actions/cart.actions';
import { AddCartItemData } from '../../_models/cart.model';
import { ProductType } from '../../_models/product.model';
import { selectProductList, selectProductPaging } from '../../_selectors/home.selector';
import { ProductQuickViewModalComponent } from '../../components/product-quick-view-modal/product-quick-view-modal.component';
import { AddToWishList } from '../../_actions/wishlist.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public products$: Observable<ProductType[]>;
  public paginator$: Observable<PaginatorModel>;
  public loadingList$: Observable<boolean>;

  constructor(
    private _store: Store<AppState>, 
    private _modalService: NgbModal,
    private _route: ActivatedRoute,
  ) {
    this._urlSubscription();
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.products$ = this._store.pipe(select(selectProductList()));
    this.paginator$ = this._store.pipe(
      select(selectProductPaging()),
      map((pagination) => pagination)
    );
    this.loadingList$ = this._store.pipe(select(selectLoading, HomeActionTypes.SearchProducts)).pipe(
      map((isLoading) => isLoading)
    );
  }

  onProductPageChange(criteria) {
    this._store.dispatch(new SaveSearchProductsCriteriaAction(criteria));
    this._fetchProducts();
  }

  onAddToCart(product: ProductType) {
    const data: AddCartItemData = {
      productId: product.id,
      quantity: 1
    };
    this._store.dispatch(new AddCartItemAction({ data }));
  }

  onAddToWishList(product: ProductType) {
    this._store.dispatch(new AddToWishList(product.id));
  }

  onOpenProductQuickViewModal(product: ProductType) {
    const modalRef = this._modalService.open(ProductQuickViewModalComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.product = product;
  }

  private _fetchProducts() {
    return this._store.dispatch(new SearchProductsAction());
  }

  private _urlSubscription() {
    this._route.queryParams.subscribe((params) => {
      const catSlug = (params && params.c) ? params.c : '';
      this._store.dispatch(new SaveProductFilterAction({ catSlug }));
      this._fetchProducts();
    });

  }
}

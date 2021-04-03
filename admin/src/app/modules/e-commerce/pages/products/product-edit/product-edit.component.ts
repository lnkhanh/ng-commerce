// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '@core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '@core/views/layout';
import { LayoutUtilsService, MessageType } from '@core/views/crud';
import {
  FetchProductDetailsAction,
  UpdateProductAction,
  UploadProductPhotosAction,
} from '@app/modules/e-commerce/_actions/product.actions';
import { selectCurrentProduct, selectCurrentProductPhotos } from '@app/modules/e-commerce/_selectors/product.selectors';
import { ProductType } from '@app/modules/e-commerce/_models/product.model';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { Location } from '@angular/common';
import { FetchStoreListAction } from '@app/modules/e-commerce/_actions/store.actions';
import { selectStoreList } from '@app/modules/e-commerce/_selectors/store.selectors';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';
import { selectCategoryList } from '@app/modules/e-commerce/_selectors/category.selectors';
import { FetchCategoryListAction } from '@app/modules/e-commerce/_actions/category.actions';

@Component({
  selector: 'kt-product-edit',
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent implements OnInit, OnDestroy {
  public productId: string;
  public product$: Observable<ProductType>;
  public selectedTab = 0;
  public loading$: Observable<boolean>;

  public stores$: Observable<StoreType[]>;
  public categories$: Observable<CategoryType[]>;
  public productPhotos$: Observable<string[]>;

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private _route: ActivatedRoute,
    private _subheaderService: SubheaderService,
    private _store: Store<AppState>
  ) {
    this.productId = this._route.snapshot.paramMap.get('id');
    this.onRouteChanges();
    this._selectStoreList();
    this._categorySubscribe();
  }

  ngOnInit() {
    this._subheaderService.setBreadcrumbs([
      { title: 'eCommerce', page: `/ecommerce/products` },
      { title: 'Products', page: `/ecommerce/products` },
      { title: 'Edit', page: `` },
    ]);

    if (this.productId) {
      this._fetchDetails();
    } else {
      // TODO
    }
    this.product$ = this._store.pipe(select(selectCurrentProduct()));
    this.loading$ = this._store.pipe(select(selectPageLoading));
    this.productPhotos$ = this._store.pipe(select(selectCurrentProductPhotos()));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  onTabChange(event: any) {
    const path = this._location.path().split('?')[0];
    this._location.replaceState(path + '?tab=' + this.selectedTab);
  }

  // General form
  onGeneralFormSubmit(data: ProductType) {
    if (!data) {
      return;
    }

    this._store.dispatch(
      new UpdateProductAction({ data: { ...data, id: this.productId } })
    );
  }
  // End general form

  // Product photos
  onUploadProductPhotos(formData: FormData) {
    this._store.dispatch(new UploadProductPhotosAction({ productId: this.productId, formData }));
  }
  // End product photos

  private onRouteChanges() {
    // Init paginator
    this.activatedRoute.queryParams.subscribe((params: { tab: number }) => {
      if (params.tab) {
        this.selectedTab = params.tab;
      }
    });
  }

  private _fetchDetails() {
    {
      return this._store.dispatch(
        new FetchProductDetailsAction({ productId: this.productId })
      );
    }
  }

  // Store
  private _selectStoreList() {
    this._fetchStoreList();
    this.stores$ = this._store.pipe(select(selectStoreList()));
  }

  private _fetchStoreList() {
    return this._store.dispatch(new FetchStoreListAction());
  }

  // Category
  private _categorySubscribe() {
    this._fetchCategoryList();
    this.categories$ = this._store.pipe(select(selectCategoryList()));
  }

  private _fetchCategoryList() {
    return this._store.dispatch(new FetchCategoryListAction());
  }
}

import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '@core/reducers';
import { LayoutUtilsService } from '@core/views/crud';
import { ProductDataSource } from '@app/modules/e-commerce/_data-sources/product.datasource';
import {
  ArchiveProductAction,
  FetchListAction,
  SaveRequestParamsAction,
} from '@app/modules/e-commerce/_actions/product.actions';
import { FetchCategoryListAction } from '@app/modules/e-commerce/_actions/category.actions';
import { FetchStoreListAction } from '@app/modules/e-commerce/_actions/store.actions';
import { ProductType } from '@app/modules/e-commerce/_models/product.model';
import { RequestParamModel } from '@app/core/models/common';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { selectStoreList } from '@app/modules/e-commerce/_selectors/store.selectors';
import { SubheaderService } from '@app/core/views/layout';
import { selectCategoryList } from '@app/modules/e-commerce/_selectors/category.selectors';
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';
import { AddNewProductDialogComponent } from '@app/modules/e-commerce/components/add-new-product-dialog/add-new-product-dialog.component';

@Component({
  selector: 'kt-products-list',
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  public stores$: Observable<StoreType[]>;
  public categories$: Observable<CategoryType[]>;

  // Table fields
  public dataSource: ProductDataSource;
  public displayedColumns = ['photo', 'name', 'price', 'salePrice', 'actions'];
  public pageSizeOptions = [10, 15, 20];
  public pageEvent;

  private filter: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
  };
  private subscriptions: Subscription[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _store: Store<AppState>,
    private _router: Router,
    private _layoutUtilsService: LayoutUtilsService,
    private _dialog: MatDialog,
    private _subheaderService: SubheaderService,
  ) {
    this.filter = {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
    };
    this._selectStoreList();
    this._categorySubscribe();
  }

  ngOnInit() {
    this._subheaderService.setBreadcrumbs([
      { title: 'eCommerce', page: `/ecommerce/products` },
      { title: 'Products', page: `/ecommerce/products` },
    ]);
    this.dataSource = new ProductDataSource(this._store);
    this.init();
    this.searchSub();
  }

  ngOnDestroy() {}

  init() {
    // Init paginator
    this._activatedRoute.queryParams.subscribe(
      (params: { page: number; pageSize: number; keyword: string }) => {
        if (params.page) {
          this.paginator.pageIndex = params.page;
          this.filter.pageIndex = +params.page + 1;
        }

        if (params.pageSize) {
          this.paginator.pageSize = params.pageSize;
          this.filter.pageSize = +params.pageSize;
        }

        if (params.keyword) {
          this.searchInput.nativeElement.value = params.keyword;
          this.filter.keyword = params.keyword;
        }

        const searchParams: RequestParamModel = {
          pageIndex: this.filter.pageIndex,
          pageSize: this.filter.pageSize,
          keyword: params.keyword || '',
        };

        this._store.dispatch(
          new SaveRequestParamsAction({ params: searchParams })
        );
        this._fetchList();
      }
    );
  }

  getPaginatorData(event) {
    this._router.navigate([location.pathname], {
      queryParams: {
        page: event.pageIndex,
        pageSize: event.pageSize,
        keyword: this.filter.keyword,
      },
    });

    return event;
  }

  onOpenNewProductDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      stores$: this.stores$,
      categories$: this.categories$
    };

    const dialogRef = this._dialog.open(
      AddNewProductDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((rs) => {
      if (rs.shouldReload && rs.userId) {
        this.onEditProduct(rs.userId);
      }
    });
  }

  onDeleteProduct(product: ProductType) {
    const title = 'Remove product';
    const description = `Are you sure you want to remove product ${product.name}?`;
    const waitDescription = 'Removing...';
    const dialogRef = this._layoutUtilsService.confirmElement(
      title,
      description,
      waitDescription
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this._store.dispatch(new ArchiveProductAction({ productId: product.id }));
    });
  }

  onEditProduct(id) {
    this._router.navigate(['../products/edit', id], {
      relativeTo: this._activatedRoute,
    });
  }

  private searchSub() {
    const searchSubscription = fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    )
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        tap((event: any) => {
          if (event.keyCode === 13) {
            this.searchEvent();
          }
        })
      )
      .subscribe();
    this.subscriptions.push(searchSubscription);
  }

  private searchEvent() {
    this._router.navigate([location.pathname], {
      queryParams: {
        page: 0,
        pageSize: this.filter.pageSize,
        keyword: this.searchInput.nativeElement.value,
      },
    });
  }

  private _fetchList() {
    return this._store.dispatch(new FetchListAction());
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

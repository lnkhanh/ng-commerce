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
import { fromEvent, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@core/reducers';
import { LayoutUtilsService } from '@core/views/crud';
import { CategoryDataSource } from '@app/modules/e-commerce/_data-sources/category.datasource';
import {
  ArchiveCategoryAction,
  FetchCategoryDetailsAction,
  FetchCategoryListAction,
  SaveCurrentCategoryAction,
  SaveRequestParamsAction,
} from '@app/modules/e-commerce/_actions/category.actions';
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';
import { RequestParamModel } from '@app/core/models/common';
import { SubheaderService } from '@app/core/views/layout';
import { ComposeCategoryDialogComponent } from '@app/modules/e-commerce/components/compose-category-dialog/compose-category-dialog.component';

@Component({
  selector: 'kt-categories-list',
  templateUrl: './category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  // Table fields
  public dataSource: CategoryDataSource;
  public displayedColumns = [
    'name',
    'slug',
    'createdAt',
    'modifiedAt',
    'actions',
  ];
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
  }

  ngOnInit() {
    this._subheaderService.setBreadcrumbs([
      { title: 'eCommerce', page: `/ecommerce/categories` },
      { title: 'Categories', page: `/ecommerce/categories` },
    ]);
    this._subheaderService.setTitle('Categories');
    this.dataSource = new CategoryDataSource(this._store);
    this.init();
    this.searchSub();
  }

  ngOnDestroy() { }

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

  onOpenNewCategoryDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';

    const dialogRef = this._dialog.open(
      ComposeCategoryDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      // Clear current category
      this._store.dispatch(new SaveCurrentCategoryAction({ category: null }));
    });
  }

  onEditCategory(categoryId: string) {
    if (!categoryId) {
      return;
    }

    this._store.dispatch(new FetchCategoryDetailsAction({ categoryId }));

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';

    const dialogRef = this._dialog.open(
      ComposeCategoryDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      // Clear current category
      this._store.dispatch(new SaveCurrentCategoryAction({ category: null }));
    });
  }

  onDeleteCategory(category: CategoryType) {
    const title = 'Remove category';
    const description = `Are you sure you want to remove category ${category.name}?`;
    const waitDescription = 'Removing....';
    const dialogRef = this._layoutUtilsService.confirmElement(
      title,
      description,
      waitDescription
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this._store.dispatch(new ArchiveCategoryAction({ categoryId: category.id }));
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
    return this._store.dispatch(new FetchCategoryListAction());
  }
}

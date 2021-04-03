// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '@core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '@core/views/layout';
import { LayoutUtilsService, MessageType } from '@core/views/crud';
import {
  FetchStoreDetailsAction,
  FetchStoreTableListAction,
  RemoveStoreTableAction,
  SaveStoreTableRequestParamsAction,
  UpdateStoreAction,
} from '@app/modules/e-commerce/_actions/store.actions';
import { selectCurrentStore } from '@app/modules/e-commerce/_selectors/store.selectors';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { Location } from '@angular/common';
import { StoreTableDataSource } from '@app/modules/e-commerce/_data-sources/store.datasource';
import { RequestParamModel } from '@app/core/models/common';

@Component({
  selector: 'ng-com-store-edit',
  templateUrl: './store-edit.component.html',
})
export class StoreEditComponent implements OnInit, OnDestroy {
  public storeId: string;
  public store$: Observable<StoreType>;
  public selectedTab = 0;
  public loading$: Observable<boolean>;

  // Table tab
  public storeTableDataSource: StoreTableDataSource;

  private destroy$: Subject<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private _route: ActivatedRoute,
    private _subheaderService: SubheaderService,
    private _store: Store<AppState>
  ) {
    this.storeId = this._route.snapshot.paramMap.get('id');
    this.destroy$ = new Subject();
    this._onRouteChanges();
    this._fetchStoreTableList();
  }

  ngOnInit() {
    this._subheaderService.setBreadcrumbs([
      { title: 'eCommerce', page: `/ecommerce/stores` },
      { title: 'Stores', page: `/ecommerce/stores` },
      { title: 'Edit', page: `` },
    ]);

    if (this.storeId) {
      this._fetchDetails();
    } else {
      // TODO
    }
    this.store$ = this._store.pipe(select(selectCurrentStore()));
    this.loading$ = this._store.pipe(select(selectPageLoading));
    this.storeTableDataSource = new StoreTableDataSource(this._store);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onTabChange(event: any) {
    const path = this._location.path().split('?')[0];
    this._location.replaceState(path + '?tab=' + this.selectedTab);
  }

  onBack() {
    this._location.back();
  }

  // General form
  onGeneralFormSubmit(data: StoreType) {
    if (!data) {
      return;
    }

    this._store.dispatch(
      new UpdateStoreAction({ data: { ...data, id: this.storeId } })
    );
  }
  // End general form

  // Table tab

  onStoreTablePagination($event) {
    this._store.dispatch(
      new SaveStoreTableRequestParamsAction({ params: {...$event} })
    );
    return this._store.dispatch(new FetchStoreTableListAction({ storeId: this.storeId }));
  }

  onRemoveTable(tableId: string) {
    return this._store.dispatch(new RemoveStoreTableAction({ storeId: this.storeId, tableId: tableId }));
  }

  private _fetchStoreTableList() {
    const searchParams: RequestParamModel = {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
    };

    this._store.dispatch(
      new SaveStoreTableRequestParamsAction({ params: searchParams })
    );

    return this._store.dispatch(new FetchStoreTableListAction({ storeId: this.storeId }));
  }
  // End table tab

  private _onRouteChanges() {
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
        new FetchStoreDetailsAction({ storeId: this.storeId })
      );
    }
  }
}

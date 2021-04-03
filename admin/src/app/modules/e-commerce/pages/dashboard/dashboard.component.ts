import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, withLatestFrom, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';

import { environment } from '@env/environment';
import { AppState } from '@core/reducers';
import * as LoadingSelector from '@core/selectors/loading.selectors';

import {
  DashBoardActionTypes,
  SaveFilterDashboardAction,
  GetOrderRevenueSummaryDashboardAction,
  FetchOrderRevenueAction,
  FetchSaleActivityAction,
  GetOrderRevenueDetailDashboardAction,
  SavePaginationDashboardAction,
} from '../../_actions/dashboard.actions';
import {
  DashBoardFilterModel,
  OrderRevenueResponse,
  OrderRevenueDetailModel,
  OrderRevenueSummaryModel,
  SaleActivityResponse,
  TabName,
  FilterDateActionEnum,
} from '../../_models/dashboard.model';
import * as DashboardSelector from '../../_selectors/dashboard.selectors';
import * as storeSelector from '../../_selectors/store.selectors';
import { StoreType } from '../../_models/store.model';
import { FetchAllStoresAction } from '../../_actions/store.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  public tabActive: number;
  public filter: DashBoardFilterModel = new DashBoardFilterModel({
    companyId: "0",
    storeId: null,
    fromDate: null,
    toDate: null,
    serviceId: null,
  });
  public filterDayActive: FilterDateActionEnum;
  public filterDayAction = FilterDateActionEnum;

  // Data
  public orderRevenueSummary: Observable<OrderRevenueSummaryModel[]>;
  public orderRevenueDetail: Observable<OrderRevenueDetailModel[]>;
  public paginator: Observable<any>;
  // Loading
  public loadingOrderRevenueSummary: Observable<boolean>;
  public loadingOrderRevenueDetail: Observable<boolean>;
  public loadingStore: Observable<boolean>;

  public orderRevenue: Observable<OrderRevenueResponse>;
  public saleActivity: Observable<SaleActivityResponse>;
  public orderRevenueLoading: Observable<boolean>;
  public saleActivityLoading: Observable<boolean>;
  private _subscriptions: Subscription[] = [];

  protected storeSubject = new BehaviorSubject<StoreType[]>([]);
  public stores: Observable<StoreType[]>;
  public storeFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _store: Store<AppState>,
  ) {
    this.stores = this.storeSubject.asObservable();
    const routeSubscription = this._activatedRoute.data.subscribe(dataResponse => {
      this.filter.serviceId = dataResponse.serviceId;
      this.onFilterChange(this.filter);
    });
    this._subscriptions.push(routeSubscription);
  }

  ngAfterViewInit(): void {
    this.onFilterDaysAction(this.filterDayAction.last30Days);
    this.handleTabAction(TabName.overview);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(el => el.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this._store.dispatch(new FetchAllStoresAction());

    // loading
    this.loadingOrderRevenueSummary = this._store.pipe(
      select(DashboardSelector.selectDashboardLoading(DashBoardActionTypes.GET_ORDER_REVENUE_SUMMARY))
    );
    this.loadingOrderRevenueDetail = this._store.pipe(
      select(DashboardSelector.selectDashboardLoading(DashBoardActionTypes.GET_ORDER_REVENUE_DETAIL))
    );
    this.orderRevenueLoading = this._store.pipe(select(LoadingSelector.selectActionLoading, DashBoardActionTypes.FETCH_ORDER_REVENUE));
    this.saleActivityLoading = this._store.pipe(select(LoadingSelector.selectActionLoading, DashBoardActionTypes.FETCH_SALE_ACTIVITY));
    this.loadingStore = this._store.pipe(select(LoadingSelector.selectPageLoading))
    // fetch data
    this.paginator = this._store.pipe(select(DashboardSelector.selectDashboardPagination));
    this.orderRevenueSummary = this._store.pipe(select(DashboardSelector.selectOrderRevenueSummaryDashboard));
    this.orderRevenue = this._store.pipe(select(DashboardSelector.selectOrderRevenue()));
    this.orderRevenueDetail = this._store.pipe(select(DashboardSelector.selectOrderRevenueDetailDashboard));
    this.saleActivity = this._store.pipe(select(DashboardSelector.selectSaleActivity()));
    const selectStoreSubject = this._store.pipe(select(storeSelector.selectAllStores())).subscribe(stores => {
      this.storeSubject.next(stores);
    });
    this._subscriptions.push(selectStoreSubject);

    const filterSubscribe = this._store.pipe(
      select(DashboardSelector.selectDashboardFilter),
      distinctUntilChanged()
    ).subscribe((res: DashBoardFilterModel) => {
      this.filter = cloneDeep(res);
      this.handleTabAction(this.tabActive);
    });
    this._subscriptions.push(filterSubscribe);

    this.storeFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        withLatestFrom(this._store.pipe(select(storeSelector.selectAllStores()))),
      ).subscribe(([values, stores]) => {
        this.filterStore(stores);
      });
  }

  protected filterStore(stores: StoreType[]): void {
    let search = this.storeFilterCtrl.value;
    if (!search) {
      this.storeSubject.next(stores);
    } else {
      search = String(search).toLowerCase();
      this.storeSubject.next(
        stores.filter(item => item.name.toLocaleLowerCase().includes(search))
      );
    }
  }

  handleOnViewMore(index: number): void {
    this.tabActive = index;
  }

  handleTabAction(index: number): void {
    if ([TabName.overview, TabName.sale, TabName.order].indexOf(index) === -1) {
      return;
    }

    const paging = { pageSize: 5, pageIndex: 0 };
    if (index !== this.tabActive && index !== TabName.overview) {
      if (index === TabName.order) {
        paging.pageSize = 10;
      }
      this.handleOnChangePaging(paging, true);
    }
    switch(index) {
      case TabName.overview:
        this.fetchOrderRevenue();
        break;
      case TabName.sale:
        this.fetchSaleActivity();
        break;
      // case TabName.order:
      //   this.fetchOrderReveneuSummary();
      //   this.fetchOrderRevenueDetail();
      //   break;
      default: break;
    };

    if (this.tabActive !== index) {
      this.tabActive = index;
    }
  }

  clearFilter(): void {
    this.onFilterChange(new DashBoardFilterModel({ companyId: '0' }));
  }

  onFilterStoreChange(storeId: any) {
    if (storeId === 'null') storeId = null;
    this.onFilterChange({ ...this.filter, storeId });
  }

  onFilterDaysAction(index: FilterDateActionEnum) {
    if (index === this.filterDayActive) return;

    let toDate = moment().format();
    const dayOfYear = moment(toDate).dayOfYear();
    let fromDate = toDate;
    switch(index) {
      case FilterDateActionEnum.today:
        fromDate = toDate;
        break;
      case FilterDateActionEnum.yesterday:
        fromDate = toDate = moment(toDate, moment.ISO_8601).dayOfYear(dayOfYear - 1).format();
        break;
      case FilterDateActionEnum.last7Days:
        fromDate = moment(toDate, moment.ISO_8601).dayOfYear(dayOfYear - 7).format();
        break;
      case FilterDateActionEnum.last30Days:
        fromDate = moment(toDate, moment.ISO_8601).dayOfYear(dayOfYear - 30).format();
        break;
      case FilterDateActionEnum.thisMonth:
        fromDate = moment(toDate, moment.ISO_8601).date(1).format();
        break;
      default:
        break;
    }
    this.onFilterDateChange(fromDate, toDate);
    this.filterDayActive = index;
  }

  onCustomRangeDayAction(event: { fromDate: string, toDate: string}, elDropDown: any) {
    elDropDown.close();
    this.filterDayActive = FilterDateActionEnum.customRange;
    this.onFilterDateChange(event.fromDate, event.toDate);
  }

  onFilterDateChange(fromDate: string, toDate: string) {
    this.filter.fromDate = fromDate;
    this.filter.toDate = toDate;

    this.onFilterChange(this.filter);
  }

  handleOnChangePaging(data: any, isChangeTabAction: boolean = false): void {
    this._store.dispatch(new SavePaginationDashboardAction(data));
    if (!isChangeTabAction) {
      this.handleTabAction(this.tabActive);
    }
  }

  private onFilterChange(data: DashBoardFilterModel): void {
    this._store.dispatch(new SaveFilterDashboardAction({...data}));
  }

  private fetchOrderReveneuSummary(): void {
    this._store.dispatch(new GetOrderRevenueSummaryDashboardAction({}));
  }

  // private fetchOrderRevenueDetail(): void {
  //   this._store.dispatch(new GetOrderRevenueDetailDashboardAction({}));
  // }

  private fetchOrderRevenue() {
    this._store.dispatch(new FetchOrderRevenueAction());
  }

  private fetchSaleActivity() {
    this._store.dispatch(new FetchSaleActivityAction());
  }
}

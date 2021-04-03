import { combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { BaseDataSource } from '@core/views/crud';
import { AppState } from '@core/reducers';
import {
  selectPosOrderList,
  selectPosOrderPagination,
} from '../_selectors/order.selectors';
import { selectActionLoading } from '@app/core/selectors/loading.selectors';
import { PosOrderActionTypes } from '../_actions/order.actions';

export class PosOrderDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();

    this.loading$ = this.store.pipe(select(selectActionLoading, PosOrderActionTypes.FetchOrderList));

    this.isPreloadTextViewed$ = this.store.pipe(select(selectActionLoading));

    this._selectListData().subscribe(([list, pagination]) => {
      this.paginatorTotalSubject.next(pagination.totalItems);
      this.entitySubject.next(list);
    });
  }

  private _selectListData() {
    return combineLatest([
      this.store.pipe(select(selectPosOrderList())),
      this.store.pipe(select(selectPosOrderPagination())),
    ]);
  }
}

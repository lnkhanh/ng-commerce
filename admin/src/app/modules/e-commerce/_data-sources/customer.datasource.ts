import { combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { BaseDataSource } from '@core/views/crud';
import { AppState } from '@core/reducers';
import {
  selectCustomerList,
  selectCustomerPagination,
} from '../_selectors/customer.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';

export class CustomerDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();

    this.loading$ = this.store.pipe(select(selectPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(select(selectPageLoading));

    this._selectListData().subscribe(([list, pagination]) => {
      this.paginatorTotalSubject.next(pagination.totalItems);
      this.entitySubject.next(list);
    });
  }

  private _selectListData() {
    return combineLatest([
      this.store.pipe(select(selectCustomerList())),
      this.store.pipe(select(selectCustomerPagination())),
    ]);
  }
}

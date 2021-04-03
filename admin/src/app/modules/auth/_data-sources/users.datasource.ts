// RxJS
import { combineLatest, forkJoin, of } from 'rxjs';
import {
  catchError,
  finalize,
  tap,
  debounceTime,
  delay,
  distinctUntilChanged,
  mergeMap,
} from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '@core/views/crud';
// State
import { AppState } from '@core/reducers';
import { selectList, selectPagination } from '../_selectors/user.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';

export class UsersDataSource extends BaseDataSource {
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
      this.store.pipe(select(selectList())),
      this.store.pipe(select(selectPagination())),
    ]);
  }
}

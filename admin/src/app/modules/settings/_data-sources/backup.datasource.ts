import { combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { BaseDataSource } from '@core/views/crud';
import { AppState } from '@core/reducers';
import {
  selectBackupList,
  selectBackupPagination,
} from '../_selectors/backup.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';

export class BackupDataSource extends BaseDataSource {
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
      this.store.pipe(select(selectBackupList())),
      this.store.pipe(select(selectBackupPagination())),
    ]);
  }
}

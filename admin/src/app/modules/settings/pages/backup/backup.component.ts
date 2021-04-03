import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestParamModel } from '@app/core/models/common';
import { AppState } from '@app/core/reducers';
import { LayoutUtilsService } from '@app/core/views/crud';
import { SubheaderService } from '@app/core/views/layout';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RemoveBackupAction, SaveRequestParamsAction, FetchBackupListAction, RestoreBackupAction, CreateBackupAction } from '../../_actions/backup.actions';
import { BackupDataSource } from '../../_data-sources/backup.datasource';
import { BackupType } from '../../_models/backup.model';

@Component({
  selector: 'ng-com-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public backups$: Observable<BackupType[]>;

  // Table fields
  public dataSource: BackupDataSource;
  public displayedColumns = ['fileName', 'status', 'createdAt', 'actions'];
  public pageSizeOptions = [10, 15, 20];
  public pageEvent;

  private filter: {
    pageIndex: number;
    pageSize: number;
  };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _store: Store<AppState>,
    private _router: Router,
    private _layoutUtilsService: LayoutUtilsService,
    private _subheaderService: SubheaderService,
  ) {
    this.filter = {
      pageIndex: 1,
      pageSize: 10,
    };
  }

  ngOnInit() {
    this._subheaderService.setBreadcrumbs([
      { title: 'Settings', page: `/settings/backup` },
      { title: 'Backups', page: `/settings/backup` },
    ]);
    this.dataSource = new BackupDataSource(this._store);
    this.init();
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

        const searchParams: RequestParamModel = {
          pageIndex: this.filter.pageIndex,
          pageSize: this.filter.pageSize,
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
      },
    });

    return event;
  }

  onCreateBackup() {
    this._store.dispatch(new CreateBackupAction());
  }

  onRestoreBackup(backup: BackupType) {
    const title = 'Restore backup';
    const description = `Warning: Are you sure you want to restore this backup?`;
    const waitDescription = 'Restoring....';
    const submitLabel = 'Restore';
    const dialogRef = this._layoutUtilsService.confirmElement(
      title,
      description,
      waitDescription,
      submitLabel
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this._store.dispatch(new RestoreBackupAction({ id: backup.id }));
    });
  }

  onDeleteBackup(backup: BackupType) {
    if (!backup.canRemove) {
      return;
    }
    
    const title = 'Remove backup';
    const description = `Are you sure you want to remove this backup?`;
    const waitDescription = 'Removing....';
    const dialogRef = this._layoutUtilsService.confirmElement(
      title,
      description,
      waitDescription,
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this._store.dispatch(new RemoveBackupAction({ backupId: backup.id }));
    });
  }

  private _fetchList() {
    return this._store.dispatch(new FetchBackupListAction());
  }
}

import { Injectable } from '@angular/core';
import {
	map,
	switchMap,
	withLatestFrom,
	catchError,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '@core/reducers';
import {
	BackupActionTypes,
	FetchBackupListAction,
	SaveListAction,
	RemoveBackupAction,
	RemoveBackupSuccessAction,
	RestoreBackupAction,
	RestoreBackupSuccessAction,
	CreateBackupAction,
} from '../_actions/backup.actions';
import { selectBackupPagination } from '../_selectors/backup.selectors';
import { RequestParamModel, ResponseStatus } from '@app/core/models/common';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
	AddLoadingAction,
	RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { BackupService } from '../_services';

@Injectable()
export class BackupEffects {
	@Effect()
	fetchList$ = this.actions$.pipe(
		ofType<FetchBackupListAction>(BackupActionTypes.FetchBackupList),
		withLatestFrom(this.store.pipe(select(selectBackupPagination()))),
		switchMap(([_, pagination]) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: BackupActionTypes.FetchBackupList })
			);

			const params = new RequestParamModel();
			params.pageIndex = pagination.pageIndex;
			params.pageSize = pagination.pageSize;

			return this.backupSvc.fetchBackupList(params);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: BackupActionTypes.FetchBackupList,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveListAction({ response: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: BackupActionTypes.FetchBackupList,
				})
			);
			return caught;
		})
	);

	@Effect()
	createBackup$ = this.actions$.pipe(
		ofType<CreateBackupAction>(BackupActionTypes.CreateBackup),
		switchMap(() => {
			this.store.dispatch(
				new AddLoadingAction({
					currentAction: BackupActionTypes.CreateBackup,
				})
			);
			return this.backupSvc.createBackup();
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: BackupActionTypes.CreateBackup,
				})
			);
			if (!rs) {
				throw new Error('');
			}

			this.toastService.showSuccess('Create backup successfully.');
			return new FetchBackupListAction();
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: BackupActionTypes.CreateBackup,
				})
			);
			this.toastService.showDanger('Ops! Something went wrong.');
			return caught;
		})
	);

	@Effect()
	restoreBackup$ = this.actions$.pipe(
		ofType<RestoreBackupAction>(BackupActionTypes.RestoreBackup),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({
					currentAction: BackupActionTypes.RestoreBackup,
				})
			);
			return this.backupSvc.restoreBackup(payload.id);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: BackupActionTypes.RestoreBackup,
				})
			);
			if (!rs) {
				throw new Error('');
			}

			this.toastService.showSuccess('Restore backup successfully.');
			return new FetchBackupListAction();
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: BackupActionTypes.RestoreBackup,
				})
			);
			this.toastService.showDanger('Ops! Something went wrong.');
			return caught;
		})
	);

	@Effect()
	removeBackup$ = this.actions$.pipe(
		ofType<RemoveBackupAction>(BackupActionTypes.RemoveBackup),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({
					currentAction: BackupActionTypes.RemoveBackup,
				})
			);
			return this.backupSvc.removeBackup(payload.backupId);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: BackupActionTypes.RemoveBackup,
				})
			);
			if (!rs) {
				throw new Error('');
			}
			this.toastService.showSuccess('Remove backup successfully.');

			this.store.dispatch(new FetchBackupListAction());
			return new RemoveBackupSuccessAction({
				isSuccess: rs.status === ResponseStatus.SUCCESS,
			});
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: BackupActionTypes.RemoveBackup,
				})
			);
			this.toastService.showDanger('Ops! Something went wrong.');
			return caught;
		})
	);

	constructor(
		private actions$: Actions,
		private backupSvc: BackupService,
		private store: Store<AppState>,
		private toastService: ToastService
	) { }
}

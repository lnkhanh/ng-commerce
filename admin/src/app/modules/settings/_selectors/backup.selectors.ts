import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BackupState } from '../_reducers/backup.reducers';

export const selectBackupState = createFeatureSelector<BackupState>('backup');

export const selectBackupPagination = () =>
	createSelector(selectBackupState, (state) => state.pagination);

export const selectBackupList = () =>
	createSelector(selectBackupState, (state) => state.list);

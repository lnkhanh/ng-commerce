import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { BackupActions, BackupActionTypes } from '../_actions/backup.actions';
import { BackupType } from '@app/modules/settings/_models/backup.model';
import produce from 'immer';

export interface BackupState extends EntityState<BackupType> {
	showInitWaitingMessage: boolean;
	list: BackupType[];
	pagination: {
		pageIndex: number;
		pageSize: number;
		keyword: string;
		totalPages: number;
		totalItems: number;
	};
}

export const adapter: EntityAdapter<BackupType> = createEntityAdapter<
	BackupType
>();

export const initialBackupState: BackupState = produce(
	adapter.getInitialState({
		showInitWaitingMessage: true,
		list: [],
		pagination: {
			pageIndex: 1,
			pageSize: 10,
			keyword: '',
			totalPages: 0,
			totalItems: 0,
		},
	}),
	(draft) => draft
);

export function backupReducer(
	state = initialBackupState,
	action: BackupActions
): BackupState {
	return produce(state, (draft) => {
		switch (action.type) {
			case BackupActionTypes.SaveList: {
				const { response } = action.payload;
				draft.list = response.records;
				draft.pagination.totalItems = response.totalItems;
				draft.pagination.totalPages = response.pages;

				break;
			}
			case BackupActionTypes.SaveRequestParams: {
				const { params } = action.payload;
				const { pageIndex, pageSize, keyword } = params;

				draft.pagination.pageIndex = pageIndex;
				draft.pagination.pageSize = pageSize;
				draft.pagination.keyword = keyword;

				break;
			}
			default:
				return state;
		}
	});
}

export const getBackupState = createFeatureSelector<BackupState>('backup');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal,
} = adapter.getSelectors();

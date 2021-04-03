import { Action } from '@ngrx/store';
import { RequestParamModel, ResponseData } from '@app/core/models/common';
import { BackupType } from '@app/modules/settings/_models/backup.model';

export enum BackupActionTypes {
	FetchBackupList = '[BACKUP] Fetch Backup List',
	SaveList = '[BACKUP] Save Backup List',

	SaveRequestParams = '[BACKUP] Save Request Params',

	CreateBackup = '[BACKUP] Create Backup',

	RemoveBackup = '[BACKUP] Archive Backup',
	RemoveBackupSuccess = '[BACKUP] Archive Backup Success',

	RestoreBackup = '[RESTORE BACKUP] Restore Backup',
	RestoreBackupSuccess = '[RESTORE BACKUP] Restore Backup Success'
}

export class FetchBackupListAction implements Action {
	readonly type = BackupActionTypes.FetchBackupList;

	constructor() { }
}

export class SaveListAction implements Action {
	readonly type = BackupActionTypes.SaveList;

	constructor(public payload: { response: ResponseData }) { }
}

export class SaveRequestParamsAction implements Action {
	readonly type = BackupActionTypes.SaveRequestParams;
	constructor(public payload: { params: RequestParamModel }) { }
}

export class CreateBackupAction implements Action {
	readonly type = BackupActionTypes.CreateBackup;
	constructor() { }
}

export class RemoveBackupAction implements Action {
	readonly type = BackupActionTypes.RemoveBackup;
	constructor(public payload: { backupId: string }) { }
}

export class RemoveBackupSuccessAction implements Action {
	readonly type = BackupActionTypes.RemoveBackupSuccess;
	constructor(public payload: { isSuccess: boolean }) { }
}

export class RestoreBackupAction implements Action {
	readonly type = BackupActionTypes.RestoreBackup;
	constructor(public payload: { id: string }) { }
}

export class RestoreBackupSuccessAction implements Action {
	readonly type = BackupActionTypes.RestoreBackupSuccess;
	constructor() { }
}

export type BackupActions =
	| FetchBackupListAction
	| SaveListAction
	| SaveRequestParamsAction
	| CreateBackupAction
	| RemoveBackupAction
	| RemoveBackupSuccessAction
	| RestoreBackupAction
	| RestoreBackupSuccessAction;

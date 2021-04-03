import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';

@Injectable()
export class BackupService {
	private _backupUrl = '/db';

	constructor(private _adminApi: AdminHttpClient) { }

	fetchBackupList(params: RequestParamModel): Observable<IResponseData> {
		const paramStr = this._adminApi.convertObjectToParamString(params);
		return this._adminApi.get<IResponseData>(`${this._backupUrl}/backup${paramStr}`);
	}

	createBackup(): Observable<IResponseData> {
		return this._adminApi.post<IResponseData>(`${this._backupUrl}/backup`, null);
	}

	restoreBackup(id: string): Observable<IResponseData> {
		return this._adminApi.post<IResponseData>(`${this._backupUrl}/restore`, { id });
	}

	removeBackup(backupId: string): Observable<IResponseData> {
		return this._adminApi.delete<IResponseData>(
			`${this._backupUrl}/backup/${backupId}`
		);
	}
}

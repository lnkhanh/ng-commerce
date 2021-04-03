export interface BackupType {
	id?: string;
	fileName: string;
	canRemove: boolean;
	status: boolean;
	createdAt?: string;
}

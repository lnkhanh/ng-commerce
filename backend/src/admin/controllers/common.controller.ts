import { Response } from "express";
import { wrap } from "@src/server";
import * as child from 'child_process';
import fs from "fs";
import path from "path";
import moment from 'moment';
import { Types } from "mongoose";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { BAD_REQUEST, OK } from 'http-status-codes';
import { IResponseData, ResponseStatus } from '@src/types/common.type';
import { CommonRepository } from '@src/repositories/common.repository';

const getProductPhoto = wrap(async (req: ISessionRequest, res: Response) => {
	const { productId, fileName } = req.params;
	const filePath = `uploads/products/${productId}/${fileName}`;

	fs.exists(filePath, (exists) => {
		if (exists) {
			res.sendFile(path.resolve(filePath));
		} else {
			res.sendFile(path.resolve('assets/img/user.png'));
		}
	});
});

const getUserAvatar = wrap(async (req: ISessionRequest, res: Response) => {
	const { userId, fileName } = req.params;
	const filePath = `uploads/user-avatars/${userId}/${fileName}`;

	fs.exists(filePath, (exists) => {
		if (exists) {
			res.sendFile(path.resolve(filePath));
		} else {
			res.sendFile(path.resolve('assets/img/user.png'));
		}
	});
});

const getBackups = wrap(async (req: ISessionRequest, res: Response) => {
	const { pageSize, pageIndex } = req.query;

	try {
		const result = await CommonRepository.getBackups(+pageIndex, +pageSize);

		if (!result) {
			throw new Error();
		}

		const data: IResponseData = {
			status: ResponseStatus.SUCCESS,
			data: result,
		};

		return res.status(OK).send(data);
	} catch (e) {
		const data: IResponseData = {
			status: ResponseStatus.FAILED,
			message: "NO_RECORDS_FOUND",
		};

		return res.status(BAD_REQUEST).json(data);
	}
});

const removeBackup = wrap(async (req: ISessionRequest, res: Response) => {
	const { id } = req.params;

	try {
		if (!id) {
			throw new Error("BACKUP_NOT_FOUND");
		}

		const backup = await CommonRepository.getBackup(Types.ObjectId(id));
		
		if (!backup) {
			throw new Error("BACKUP_NOT_FOUND");
		}

		if (!backup.canRemove) {
			throw new Error();
		}

		const filePath = path.resolve(`db-backup/${backup.fileName}`);
		const removeRs = await CommonRepository.removeBackup(Types.ObjectId(id), filePath);
		let message = 'REMOVE_BACKUP_SUCCESS';

		if (!removeRs) {
			message = 'BACKUP_FILE_NOT_FOUND';
		}

		const rsData: IResponseData = {
			status: ResponseStatus.SUCCESS,
			message
		};

		return res.status(OK).send(rsData);
	} catch (e) {
		console.log(e);
		const data: IResponseData = {
			status: ResponseStatus.FAILED,
			message: "SOMETHING_WENT_WRONG",
		};

		return res.status(BAD_REQUEST).json(data);
	}
});

const backupDB = wrap(async (req: ISessionRequest, res: Response) => {
	const fileName = `backup_${moment().format('YYYY-MM-DDD-HH-MM-ss')}.gz`;
	const saveBackup = await CommonRepository.addBackup({ fileName });
	const filePath = path.resolve(`db-backup/${fileName}`);

	// Project root
	child.exec(`mongodump --db=ngcommerce --archive=${filePath} --gzip`, (error) => {
		if (error) {
			// Rollback
			CommonRepository.removeBackup(saveBackup._id);

			return res.status(BAD_REQUEST).json(<IResponseData>{
				status: ResponseStatus.FAILED,
				message: `error: ${error.message}`
			});
		}

		return res.status(OK).json(<IResponseData>{
			status: ResponseStatus.SUCCESS,
			message: "BACKUP_SUCCESSFUL",
			data: saveBackup
		});
	});
});

const restoreDB = wrap(async (req: ISessionRequest, res: Response) => {
	const { id } = req.body;

	if (!id) {
		return res.status(OK).json(<IResponseData>{
			status: ResponseStatus.FAILED,
			message: "INVALID_REQUEST",
		});
	}

	const backup = await CommonRepository.getBackup(id);

	if (!backup) {
		return res.status(BAD_REQUEST).json(<IResponseData>{
			status: ResponseStatus.FAILED,
			message: "INVALID_RESTORE_REQUEST",
		});
	}

	const filePath = path.resolve(`db-backup/${backup.fileName}`);

	// Project root
	child.exec(`mongorestore --gzip --archive=${filePath} --drop`, (error) => {
		if (error) {
			// Update backup status
			CommonRepository.updateBackupStatus(id, false);
			return res.status(BAD_REQUEST).json(<IResponseData>{
				status: ResponseStatus.FAILED,
				message: `error: ${error.message}`
			});
		}

		return res.status(OK).json(<IResponseData>{
			status: ResponseStatus.SUCCESS,
			message: "RESTORE_SUCCESSFUL",
		});
	});
});

const restoreSampleDB = wrap(async (req: ISessionRequest, res: Response) => {
	const { fileName } = req.body;
	
	if (!fileName) {
		return res.status(OK).json(<IResponseData>{
			status: ResponseStatus.FAILED,
			message: "INVALID_REQUEST",
		});
	}

	const filePath = path.resolve(`db-backup/${fileName}`);

	// Project root
	child.exec(`mongorestore --gzip --archive=${filePath} --drop`, (error) => {
		if (error) {
			// Update backup status
			return res.status(BAD_REQUEST).json(<IResponseData>{
				status: ResponseStatus.FAILED,
				message: `error: ${error.message}`
			});
		}

		return res.status(OK).json(<IResponseData>{
			status: ResponseStatus.SUCCESS,
			message: "RESTORE_SAMPLE_DB_SUCCESSFUL",
		});
	});
});

export {
	getProductPhoto,
	getUserAvatar,
	getBackups,
	removeBackup,
	backupDB,
	restoreDB,
	restoreSampleDB
};
import { Router } from "express";
import { isUser } from "../middleware/account.middleware";
import { restoreSampleData } from '@admin/middleware/common.middleware';
import {
	getProductPhoto,
	getUserAvatar,
	getBackups,
	backupDB,
	restoreDB,
	removeBackup,
	restoreSampleDB
} from '@admin/controllers/common.controller';

export const commonAdminRouter = Router();

commonAdminRouter.get("/assets/products/:productId/:fileName", getProductPhoto);
commonAdminRouter.get("/assets/user-avatars/:userId/:fileName", getUserAvatar);
commonAdminRouter.get("/db/backup", isUser, getBackups);
commonAdminRouter.delete("/db/backup/:id", isUser, removeBackup);
commonAdminRouter.post("/db/backup", isUser, backupDB);
commonAdminRouter.post("/db/restore", isUser, restoreDB);
commonAdminRouter.post("/db/restore-sample-data", restoreSampleData, restoreSampleDB);
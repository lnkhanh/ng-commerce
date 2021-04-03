import multer from "multer";
import path from "path";
import mkdirp from "mkdirp";
import { Request } from "express";


/**
 * Upload avatar
 */
const storage = multer.diskStorage({
	destination: (req: Request & { userId: string }, file, cb) => {
		const userId = req.userId || req.params.id;
		if (!userId) {
			cb(null, null);
		}

		const dest = `uploads/user-avatars/${userId}`;
		mkdirp.sync(dest); // Create if not existing
		cb(null, dest);
	},
	filename: (req: Request, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, path.basename(file.originalname, ext) + '-' + Date.now() + ext);
	},
});

const fileFilter = function (req: Request, file: any, cb: any) {
	const allowedTypes = [".png", ".jpg", ".jpeg"],
		fileExt = path.extname(file.originalname);
	if (!allowedTypes.includes(fileExt.toLocaleLowerCase())) {
		return cb(null, false);
	}

	cb(null, true);
};

export const uploadAvatarHandler = multer({ fileFilter, storage });
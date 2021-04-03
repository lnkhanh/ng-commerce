import multer from "multer";
import path from "path";
import mkdirp from 'mkdirp';
import { ISessionRequest } from "@src/types/account/session-request.type";

/**
 * Upload product images
 */
const productStorage = multer.diskStorage({
	destination: (req: ISessionRequest, file, cb) => {
		const { productId } = req.params;
		const dest = `uploads/products/${productId}`;
		mkdirp.sync(dest); // Create if not existing
		cb(null, dest);
	},
	filename: (req: ISessionRequest, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, path.basename(file.originalname, ext) + '-' + Date.now() + ext);
	},
});

const productFileFilter = function (req: ISessionRequest, file: any, cb: any) {
	const allowedTypes = [".png", ".jpg", ".jpeg"],
		fileExt = path.extname(file.originalname);

	if (!allowedTypes.includes(fileExt.toLocaleLowerCase())) {
		return cb(null, false);
	}

	cb(null, true);
};

export const uploadProductPhotosHandler = multer({ fileFilter: productFileFilter, storage: productStorage });
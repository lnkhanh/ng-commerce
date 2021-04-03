import * as mongoose from "mongoose";
import { IUserModel, IUser } from "@src/types/user.type";
import { IAccountModel } from "@src/types/account.type";
import { IWishListModel } from "@src/types/wishlist.type";
import { TransformData } from "@src/utils/transform-data";
import { PermissionEnum } from '@src/models/User';

const LegacyUser = <IUser<IUserModel>>mongoose.model("User");
const LegacyWishList = <IUser<IWishListModel>>mongoose.model("WishList");

export class AccountRepository {
	public static async authenticate(
		email: string,
		password: string
	): Promise<IAccountModel | boolean> {
		const user = await LegacyUser.findOne({
			email: {
				$regex: new RegExp(`^${email}$`, "i"),
			},
		}).exec();

		if (user && user.authenticate(password)) {
			return TransformData.transformLegacyUser(user);
		}

		return false;
	}

	public static async createLocalAccount(
		detail: {
			firstName: string,
			lastName: string,
			email: string;
			password: string;
		}
	): Promise<IAccountModel> {
		const { firstName, lastName, email, password } = detail;

		const user = await LegacyUser.create({
			provider: "local",
			firstName,
			lastName,
			email,
			password,
			role: PermissionEnum.CustomerUser,
			needUpdatePassword: false
		});

		return TransformData.transformLegacyUser(user);
	}

	public static async updateAccountInfo(
		userId: string,
		data: {
			firstName: string;
			lastName: string;
			phone: string;
			gender: string;
			address: string;
		}
	): Promise<IAccountModel> {
		const foundUser: IUserModel = await LegacyUser.findById(userId).exec();

		if (!foundUser) {
			return null;
		}

		const { firstName, lastName, phone, gender, address } = data;
		foundUser.firstName = firstName;
		foundUser.lastName = lastName;
		foundUser.phone = phone;
		foundUser.gender = gender;
		foundUser.address = address;

		await foundUser.save();

		return TransformData.transformLegacyUser(foundUser);
	}

	public static async emailExisted(
		emailString: string
	): Promise<IAccountModel> {
		const user = await LegacyUser.findOne({
			email: new RegExp(`^${emailString}$`, "i"),
		}).exec();
		if (user) {
			return TransformData.transformLegacyUser(user);
		}
		return null;
	}

	public static async userExisted(
		userId: string
	): Promise<IAccountModel> {
		const user = await LegacyUser.findOne({ _id: userId }).exec();
		if (user) {
			return TransformData.transformLegacyUser(user);
		}
		return null;
	}

	// WishList
	public static async getWishList(page = 1, perPage = 10, userId: string) {
		const paginateOptions = {
			populate: "product",
      sort: { createdAt: -1 },
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const wishListResult = await LegacyWishList.paginate({ userId }, paginateOptions);

    if (!wishListResult) {
      return null;
    }

    const lastResults: any[] = [];

    wishListResult.docs.forEach((record: any) => {
			const product = TransformData.transformLegacyProduct(record._doc.product);
			const productId = product.id;
			delete product.id;

      lastResults.push(
        Object.assign({}, {
					id: record._doc._id,
					createdAt: record._doc.createdAt,
				}, {
					productId,
					...product
				})
      );
    });

		return {
      totalItems: wishListResult.total,
      pages: Math.ceil(wishListResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
	}

	public static async addWishList(userId: string, productId: string): Promise<IWishListModel> {
		const existed = await LegacyWishList.findOne({
			userId,
			product: productId
		}).exec();

		if (existed) {
			return existed;
		}

		const wishList = await LegacyWishList.create({
			userId,
			product: productId
		});

		return wishList;
	}

	public static async removeWishList(id: string): Promise<boolean> {
		const rs = await LegacyWishList.find({
			_id: id,
		})
			.remove()
			.exec();
		
		return rs.deletedCount > 0;
	}

	public static async checkAddedWishList(userId: string, productId: string): Promise<boolean> {
		const item = await LegacyWishList.findOne({
			userId,
			product: productId
		}).exec();

		if (item) {
			return true;
		}

		return false;
	}
	// \End WishList
}
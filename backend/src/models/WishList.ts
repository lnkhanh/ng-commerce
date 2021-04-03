import { Schema, Types, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { IWishListModel, IWishList } from "@src/types/wishlist.type";

const wishListSchema: Schema = new Schema({
	userId: {
		type: Types.ObjectId,
		ref: "User",
	},
	product: {
		type: Types.ObjectId,
		ref: "Product"
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

wishListSchema.plugin(mongoosePaginate);
const WishList: IWishList<IWishListModel> = model<IWishListModel>(
	"WishList",
	wishListSchema
);

export default WishList;

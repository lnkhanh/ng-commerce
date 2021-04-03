import { Schema, Types, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { ICartItem, ICartItemModel } from "@src/types/cart-item.type";

const cartItemSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    retailPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 250
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      index: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    title: String,
    categoryId: String,
    categoryName: String,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    read: "primaryPreferred",
  }
);

cartItemSchema.virtual("totalRetailPrice").get(function () {
  return this.retailPrice * this.quantity;
});

cartItemSchema.virtual("totalSalePrice").get(function () {
  return this.salePrice * this.quantity;
});

cartItemSchema.plugin(mongoosePaginate);

const CartItem: ICartItem<ICartItemModel> = model<ICartItemModel>(
  "CartItem",
  cartItemSchema
);

export default CartItem;

import { Schema, Types, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { IProduct, IProductModel } from "@src/types/product.type";

const productSchema = new Schema({
  name: {
    type: String,
    default: "",
    required: "Please fill Product name",
    trim: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String]
  },
  retailPrice: Number,
  salePrice: Number,
  dimension: {
    type: String
  },
  optionSets: {
    type: String
  },
  category: {
    type: Types.ObjectId,
    ref: "Category",
  },
  store: {
    type: Types.ObjectId,
    ref: "Store",
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
});

productSchema.plugin(mongoosePaginate);

const Product: IProduct<IProductModel> = model<IProductModel>(
  "Product",
  productSchema
);

export default Product;

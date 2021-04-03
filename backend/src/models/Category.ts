import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { ICategoryModel, ICategory } from "@src/types/category.type";

const storeSchema: Schema = new Schema({
  name: {
    type: String
  },
  slug: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  modifiedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

storeSchema.plugin(mongoosePaginate);
const Category: ICategory<ICategoryModel> = model<ICategoryModel>(
  "Category",
  storeSchema
);

export default Category;

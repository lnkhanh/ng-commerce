import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { ICategory, ICategoryModel } from "@src/types/category.type";
import { TransformData } from "@src/utils/transform-data";
import { Functions } from '@src/utils/functions';

const LegacyCategory = <ICategory<ICategoryModel>>mongoose.model("Category");

export class CategoryRepository {
  public static async getCategories(page = 1, perPage = 10, keyword: string) {
    const paginateOptions = {
      sort: { createdAt: -1 },
      populate: "createdBy",
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const conditions: { 
      isDeleted: boolean;
      name?: { [key:string]: string };
     } = { isDeleted: false };

    if (keyword) {
      conditions.name = { $regex: `.*${keyword}.*`, $options: 'i' };
    }

    const categoryResult = await LegacyCategory.paginate(conditions, paginateOptions);

    if (!categoryResult) {
      return null;
    }

    const lastResults: any[] = [];

    categoryResult.docs.forEach((record: any) => {
      lastResults.push(
        Object.assign({}, TransformData.transformLegacyCategory(record._doc), {
          createdBy: TransformData.transformLegacyUser(record._doc.createdBy),
        })
      );
    });

    return {
      totalItems: categoryResult.total,
      pages: Math.ceil(categoryResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async getAllCategories() {
    const paginateOptions = {
      sort: { name: 1 },
      populate: "createdBy",
    };

    const categoryResult = await LegacyCategory.paginate({
      isDeleted: false
    }, paginateOptions);

    if (!categoryResult) {
      return null;
    }

    const lastResults: any[] = [];

    categoryResult.docs.forEach((record: any) => {
      lastResults.push(TransformData.transformLegacyCategory(record._doc));
    });

    return lastResults;
  }

  public static async getCategory(categoryId: Types.ObjectId) {
    const category = await LegacyCategory.findOne({ _id: categoryId })
      .exec();

    if (!category) {
      return null;
    }

    return TransformData.transformLegacyCategory(category);
  }

  public static async getCategoryBySlug(slug: string) {
    const category = await LegacyCategory.findOne({ slug })
      .exec();

    if (!category) {
      return null;
    }

    return TransformData.transformLegacyCategory(category);
  }

  public static async addCategory(data: {
    name: string;
    slug?: string;
  }) {
    data.slug = Functions.getSlug(data.name);
    const category = await LegacyCategory.create(data);

    return TransformData.transformLegacyCategory(category);
  }

  public static async editCategory(
    id: Types.ObjectId,
    name: string,
  ) {
    const slug = Functions.getSlug(name);

    const category = await LegacyCategory.findOneAndUpdate(
      { _id: id },
      { $set: { name, slug, modifiedAt: Date.now() } },
      { new: true }
    ).exec();

    return TransformData.transformLegacyCategory(category);
  }

  public static async removeCategory(catId: Types.ObjectId) {
    const rs = await LegacyCategory.findOneAndUpdate(
      { _id: catId },
      { $set: { isDeleted: true } },
      { new: true }
    ).exec();

    return rs;
  }
}

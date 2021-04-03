import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { AddProductType, IProduct, IProductModel, ProductDimension } from "@src/types/product.type";
import { TransformData } from "@src/utils/transform-data";
import { OptionSet } from '@src/types/option-set.type';

const LegacyProduct = <IProduct<IProductModel>>mongoose.model("Product");
const API_URL = process.env.API_URL + '/api/admin/v1';

export class ProductRepository {
  public static async getProducts(page = 1, perPage = 10, keyword?: string, categoryId?: string) {
    const paginateOptions = {
      sort: { name: 1 },
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const conditions: { 
      isDeleted: boolean;
      name?: { [key:string]: string };
      category?: string;
     } = { isDeleted: false };

    if (keyword) {
      conditions.name = { $regex: `.*${keyword}.*`, $options: 'i' };
    }

    if (categoryId) {
      conditions.category = categoryId;
    }

    const productResult = await LegacyProduct.paginate(
      conditions,
      paginateOptions
    );

    if (!productResult) {
      return null;
    }

    const lastResults: any[] = [];

    productResult.docs.forEach((record: any) => {
      lastResults.push(TransformData.transformLegacyProduct(record._doc));
    });

    return {
      totalItems: productResult.total,
      pages: Math.ceil(productResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async getAllProducts() {
    const paginateOptions = {
      sort: { name: 1 },
      limit: 200
    };

    const productResult = await LegacyProduct.paginate(
      { isDeleted: false },
      paginateOptions
    );

    if (!productResult) {
      return null;
    }

    const lastResults: any[] = [];

    productResult.docs.forEach((record: any) => {
      lastResults.push(TransformData.transformLegacyProduct(record._doc));
    });

    return lastResults;
  }

  public static async getProduct(productId: string) {
    const product = await LegacyProduct.findOne({
      _id: Types.ObjectId(productId),
    }).exec();

    if (!product) {
      return null;
    }

    return TransformData.transformLegacyProduct(product);
  }

  public static async addProduct(data: AddProductType) {
    const product = await LegacyProduct.create(data);

    return TransformData.transformLegacyProduct(product);
  }

  public static async editProduct(data: {
    id: Types.ObjectId;
    name: string;
    description: string;
    retailPrice: number;
    salePrice: number;
    storeId: string;
    categoryId: string;
    optionSets: OptionSet[],
    dimension: ProductDimension
  }) {
    const product = await LegacyProduct.findOneAndUpdate(
      { _id: data.id },
      {
        $set: {
          name: data.name,
          description: data.description,
          retailPrice: data.retailPrice,
          salePrice: data.salePrice,
          store: data.storeId,
          category: data.categoryId,
          optionSets: JSON.stringify(data.optionSets || []),
          dimension: data.dimension ? JSON.stringify(data.dimension) : null
        },
      },
      { new: true }
    ).exec();

    if (!product) {
      return null;
    }

    return TransformData.transformLegacyProduct(product);
  }

  public static async saveUploadPhotos(productId: string, files: any[]) {
    let fileNames: string[] = [];

    const product = await LegacyProduct.findOne({
      _id: Types.ObjectId(productId),
    }).exec();

    if (product) {
      fileNames = [...product.images];
    }

    files.forEach((file) => {
      const photoUrl = `${API_URL}/assets/products/${productId}/${file.filename}`;
      fileNames.push(photoUrl);
    });

    const result = await LegacyProduct.findOneAndUpdate(
      { _id: Types.ObjectId(productId) },
      { $set: { images: fileNames } },
      { new: true }
    ).exec();

    return TransformData.transformLegacyProduct(result);
  }

  public static async archiveProduct(productId: Types.ObjectId) {
    const product = await LegacyProduct.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    ).exec();

    if (!product || product.isDeleted === false) {
      return false;
    }

    return true;
  }
}

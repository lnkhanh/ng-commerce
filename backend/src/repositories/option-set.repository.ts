import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { IProduct } from "@src/types/product.type";
import { TransformData } from "@src/utils/transform-data";
import { IOptionSetModel, OptionSet } from '@src/types/option-set.type';

const LegacyOptionSet = <IProduct<IOptionSetModel>>mongoose.model("OptionSet");

export class OptionSetRepository {
  public static async getOptionSets(page = 1, perPage = 10, keyword = '') {
    const paginateOptions = {
      sort: { createdAt: -1 },
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const conditions: {
      name?: { [key: string]: string };
    } = {};

    if (keyword) {
      conditions.name = { $regex: `.*${keyword}.*`, $options: 'i' };
    }

    const optionSetResult = await LegacyOptionSet.paginate(conditions, paginateOptions);

    if (!optionSetResult) {
      return null;
    }

    const lastResults: any[] = [];

    optionSetResult.docs.forEach((record: any) => {
      lastResults.push(TransformData.transformOptionSet(record._doc));
    });

    return {
      totalItems: optionSetResult.total,
      pages: Math.ceil(optionSetResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async getOptionSet(optionSetId: string) {
    const optionSet = await LegacyOptionSet.findOne({ _id: Types.ObjectId(optionSetId) })
      .exec();

    if (!optionSet) {
      return null;
    }

    return TransformData.transformOptionSet(optionSet);
  }

  public static async addOptionSet(data: OptionSet) {
    const optionSet = await LegacyOptionSet.create(data);
    return TransformData.transformOptionSet(optionSet);
  }

  public static async editOptionSet(data: OptionSet) {
    const { id, name, displayName, displayControlType, options, displayOrder } = data;

    const optionSet = await LegacyOptionSet.findOneAndUpdate(
      { _id: id },
      { $set: { name, displayName, displayControlType, options: JSON.stringify(options), displayOrder, modifiedAt: Date.now() } },
      { new: true }
    ).exec();

    return TransformData.transformOptionSet(optionSet);
  }

  public static async removeOptionSet(optionSetId: string) {
    return LegacyOptionSet.find({ _id: Types.ObjectId(optionSetId) }).remove().exec();
  }
}

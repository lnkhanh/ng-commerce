import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { IStore, IStoreModel } from "@src/types/store.type";
import { IStoreTable, IStoreTableModel } from "@src/types/store-table.type";
import { TransformData } from "@src/utils/transform-data";

const LegacyStore = <IStore<IStoreModel>>mongoose.model("Store");
const LegacyStoreTable = <IStoreTable<IStoreTableModel>>mongoose.model("StoreTable");

export class StoreRepository {
  public static async getStores(page = 1, perPage = 10, keyword: string) {
    const paginateOptions = {
      sort: { createdAt: -1 },
      populate: "createdBy",
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const conditions: {
      name?: { [key: string]: string };
    } = {};

    if (keyword) {
      conditions.name = { $regex: `.*${keyword}.*`, $options: 'i' };
    }

    const storeResult = await LegacyStore.paginate(conditions, paginateOptions);

    if (!storeResult) {
      return null;
    }

    const lastResults: any[] = [];

    storeResult.docs.forEach((record: any) => {
      lastResults.push({ ...TransformData.transformLegacyStore(record._doc) });
    });

    return {
      totalItems: storeResult.total,
      pages: Math.ceil(storeResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async getAllStores() {
    const storeResult = await LegacyStore.find({}).exec();

    if (!storeResult) {
      return null;
    }

    const lastResults: any[] = [];

    storeResult.forEach((record: any) => {
      lastResults.push({ ...TransformData.transformLegacyStore(record._doc) })
    });

    return lastResults;
  }

  public static async getStore(storeId: Types.ObjectId) {
    const store = await LegacyStore.findOne({ _id: storeId })
      .exec();

    if (!store) {
      return null;
    }

    return TransformData.transformLegacyStore(store);
  }

  public static async addStore(data: {
    name: string;
    address: string;
    createdBy: Types.ObjectId;
  }) {
    const store = await LegacyStore.create(data);

    return TransformData.transformLegacyStore(store);
  }

  public static async editStore(
    id: Types.ObjectId,
    name: string,
    address: string
  ) {
    const store = await LegacyStore.findOneAndUpdate(
      { _id: id },
      { $set: { name, address, modifiedAt: Date.now() } },
      { new: true }
    ).exec();

    return TransformData.transformLegacyStore(store);
  }

  public static async removeStore(storeId: Types.ObjectId) {
    return LegacyStore.find({ _id: storeId }).remove().exec();
  }

  // Store table
  public static async getStoreTables(storeId: string, page = 1, perPage = 10, keyword: string) {
    const paginateOptions = {
      sort: { createdAt: -1 },
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const conditions: {
      storeId: string;
      name?: { [key: string]: string };
    } = {
      storeId
    };

    if (keyword) {
      conditions.name = { $regex: `.*${keyword}.*`, $options: 'i' };
    }

    const storeTableResult = await LegacyStoreTable.paginate(conditions, paginateOptions);

    if (!storeTableResult) {
      return null;
    }

    const lastResults: any[] = [];

    storeTableResult.docs.forEach((record: any) => {
      const { _id, storeId, name, createdAt, modifiedAt } = record._doc;
      lastResults.push({
        id: _id,
        storeId,
        name,
        createdAt,
        modifiedAt
      });
    });

    return {
      totalItems: storeTableResult.total,
      pages: Math.ceil(storeTableResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async getTablesByStoreId(storeId: Types.ObjectId) {
    const tableResult = await LegacyStoreTable.find({ storeId }).exec();

    if (!tableResult) {
      return null;
    }

    const lastResults: any[] = [];

    tableResult.forEach((record: any) => {
      const { _id, storeId, name, createdAt, modifiedAt } = record._doc;

      lastResults.push({
        id: _id,
        storeId,
        name,
        createdAt,
        modifiedAt
      })
    });

    return lastResults;
  }

  public static async addStoreTable(data: {
    storeId: string;
    name: string;
  }) {
    const foundStore = await LegacyStore.findById(data.storeId).exec();

    if (!foundStore) {
      return null;
    }

    const storeTable = await LegacyStoreTable.create(data);

    if (!storeTable) {
      return null;
    }

    const { _id, storeId, name, createdAt, modifiedAt } = storeTable;

    return {
      id: _id,
      storeId,
      name,
      createdAt,
      modifiedAt
    };
  }

  public static async editStoreTable(data: {
    id: Types.ObjectId,
    name: string,
  }) {
    const storeTable = await LegacyStoreTable.findOneAndUpdate(
      { _id: data.id },
      { $set: { name: data.name, modifiedAt: Date.now() } },
      { new: true }
    ).exec();

    if (!storeTable) {
      return null;
    }

    const { _id, storeId, name, createdAt, modifiedAt } = storeTable;

    return {
      id: _id,
      storeId,
      name,
      createdAt,
      modifiedAt
    };
  }

  /**
   * 
   * @param id Store Table Id
   */
  public static async removeStoreTable(id: Types.ObjectId) {
    return LegacyStoreTable.find({ _id: id }).remove().exec();
  }
}

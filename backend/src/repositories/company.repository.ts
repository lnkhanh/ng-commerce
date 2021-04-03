import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { ICompany, ICompanyModel } from "@src/types/company.type";
import { TransformData } from "@src/utils/transform-data";

const LegacyCompany = <ICompany<ICompanyModel>>mongoose.model("Company");

export class CompanyRepository {
  public static async getCompanies(page = 1) {
    const perPage = 10;
    const paginateOptions = {
      sort: { createdAt: 1 },
      populate: "createdBy",
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const companyResult = await LegacyCompany.paginate({}, paginateOptions);

    if (!companyResult) {
      return null;
    }

    const lastResults: any[] = [];

    companyResult.docs.forEach((record: any) => {
      lastResults.push(
        Object.assign({}, TransformData.transformLegacyCompany(record._doc), {
          createdBy: TransformData.transformLegacyUser(record._doc.createdBy),
        })
      );
    });

    return {
      totalItems: companyResult.total,
      pages: Math.ceil(companyResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async getCompany(companyId: string) {
    const company = await LegacyCompany.findOne({ _id: Types.ObjectId(companyId) })
      .populate("createdBy")
      .exec();

    if (!company) {
      return null;
    }

    return TransformData.transformLegacyCompany(company);
  }

  public static async addCompany(data: {
    name: string;
    address: string;
    createdBy: Types.ObjectId
  }) {
    const company = await LegacyCompany.create(data);

    return TransformData.transformLegacyCompany(company);
  }

  public static async editCompany(
    companyId: Types.ObjectId,
    name: string,
    address: string
  ) {
    const company = await LegacyCompany.findOneAndUpdate(
      { _id: companyId },
      { $set: { name, address, modifiedAt: Date.now() } },
      { new: true }
    ).exec();

    return TransformData.transformLegacyCompany(company);
  }

  public static async removeCompany(companyId: Types.ObjectId) {
    return LegacyCompany.find({ _id: companyId }).remove().exec();
  }
}

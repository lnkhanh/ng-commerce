import * as mongoose from "mongoose";
import moment from "moment";
import { OrderRevenueDataType, TopProductSaleType } from '@src/types/report.type';
import { IOrder, IOrderModel } from '@src/types/order.type';
import { transformOrderRevenueReport, transformProductSaleReport } from './order.transforms';

const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const LegacyOrder = <IOrder<IOrderModel>>mongoose.model("Order");

export class ReportRepository {
  public static async getOrderRevenue(storeId: string, startDate: string, endDate: string): Promise<OrderRevenueDataType> {
    const start = moment(startDate).startOf('day').format(DATE_FORMAT);
    const end = moment(endDate).endOf('day').format(DATE_FORMAT);

    const conditions:{
      storeId?: string;
      createdDate: {
        $gt: string,
        $lt: string
      }
    } = {
      createdDate: {
        $gt: start,
        $lt: end
      }
    };

    if (storeId) {
      conditions.storeId = storeId;
    }

    const results = await LegacyOrder.find(conditions).exec();

    return transformOrderRevenueReport(results, startDate, endDate);
  }

  public static async getTopSales(storeId: string, startDate: string, endDate: string, top = 5): Promise<TopProductSaleType[]> {
    const start = moment(startDate).startOf('day').format(DATE_FORMAT);
    const end = moment(endDate).endOf('day').format(DATE_FORMAT);

    const conditions:{
      storeId?: string;
      createdDate: {
        $gt: string,
        $lt: string
      }
    } = {
      createdDate: {
        $gt: start,
        $lt: end
      }
    };

    if (storeId) {
      conditions.storeId = storeId;
    }

    const results = await LegacyOrder.find(conditions).exec();

    return transformProductSaleReport(results, top);
  }
}

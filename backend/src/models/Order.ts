import { Schema, Types, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { IOrder, IOrderModel, OrderStatuses } from "@src/types/order.type";

const orderSchema: Schema = new Schema({
  code: {
    type: String,
    default: "",
    required: "Please fill Order code",
    trim: true,
  },
  storeId: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  tableName: {
    type: String,
    required: true,
  },
  user: {
		type: Types.ObjectId,
		ref: "User",
		index: true,
	},
  address: {
    type: String,
    default: "",
    required: "Please fill Order address",
    trim: true,
  },
  status: {
    type: Number,
    default: OrderStatuses.New
  },
  products: [Object],
  note: {
    type: String,
    trim: true,
    maxlength: 250
  },
  // Customer
  customerId: {
    type: String
  },
  phone: {
    type: Number,
    default: null
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  createdDate: {
		type: Date,
		default: Date.now,
  },
  source: {
    type: Number,
    required: true
  },
  displayMessage: String,
  createdTimestamp: Number,
  shippedDate: String,
  isFirstOrder: Boolean,
  metadata: Object,
  isDeleted: {
    type: Boolean,
    default: false
  },
});

orderSchema.plugin(mongoosePaginate);

const Order: IOrder<IOrderModel> = model<IOrderModel>(
  "Order",
  orderSchema
);

export default Order;

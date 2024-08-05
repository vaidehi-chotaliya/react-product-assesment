import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { statusBadRequest } from "src/common/constants/response.status.constant";
import { AuthExceptions } from "src/common/helpers/exceptions/auth.exception";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order, OrderDocument } from "./schemas/order.schema";
import { ORDER_NOT_FOUND } from "src/common/constants/response.constants";
import { Users, UsersDocument } from "src/users/schemas/user.schema";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(orderDto: CreateOrderDto) {
    try {
      const checkUserExist = await this.userModel.findOne({
        email: orderDto.email,
      });
      if (!checkUserExist) {
        await this.userModel.create({ email: orderDto.email });
      }
      const order = await this.orderModel.create(orderDto);
      return order;
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  commonLookupFunction(
    aggregateQuery,
    tableName: string,
    localField: string,
    foreignField: string,
    topicName: string,
    isUnwind: boolean,
  ) {
    aggregateQuery.push({
      $lookup: {
        from: tableName,
        localField: localField,
        foreignField: foreignField,
        as: topicName,
      },
    });

    if (isUnwind) {
      aggregateQuery.push({
        $unwind: {
          path: `$${topicName}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    }
  }

  async getOrderDetails(orderId: string) {
    console.log("inside order details");

    try {
      // Validate order existence
      const orderData = await this.orderModel.findOne({
        _id: new mongoose.Types.ObjectId(orderId),
      });

      if (!orderData) {
        throw AuthExceptions.customException(ORDER_NOT_FOUND, statusBadRequest);
      }

      // Initialize aggregation pipeline
      const aggregateQuery: any[] = [
        {
          $match: { _id: new mongoose.Types.ObjectId(orderId) },
        },
      ];

      // Define lookup configurations
      const lookups = [
        {
          tableName: "productEntries",
          localField: "productEntryId",
          foreignField: "_id",
          topicName: "productEntries",
          isUnwind: true,
        },
        {
          tableName: "products",
          localField: "productEntries.productId",
          foreignField: "_id",
          topicName: "productDetail",
          isUnwind: true,
        },
        {
          tableName: "sizes",
          localField: "productEntries.sizeId",
          foreignField: "_id",
          topicName: "size",
          isUnwind: true,
        },
        {
          tableName: "colors",
          localField: "productEntries.colorId",
          foreignField: "_id",
          topicName: "color",
          isUnwind: true,
        },
      ];

      // Apply lookups
      lookups.forEach(
        ({ tableName, localField, foreignField, topicName, isUnwind }) => {
          this.commonLookupFunction(
            aggregateQuery,
            tableName,
            localField,
            foreignField,
            topicName,
            isUnwind,
          );
        },
      );

      // Grouping results
      aggregateQuery.push({
        $group: {
          _id: "$_id",
          productEntryId: { $first: "$productEntryId" },
          email: { $first: "$email" },
          orderValue: { $first: "$orderValue" },
          productName: { $first: "$productDetail.name" },
          productDescription: { $first: "$productDetail.description" },
          productImage: { $first: "$productDetail.image" },
          size: { $first: "$size.name" },
          color: { $first: "$color.name" },
        },
      });

      // Execute the aggregation pipeline
      const userOrder = await this.orderModel.aggregate(aggregateQuery);
      return userOrder[0];
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}

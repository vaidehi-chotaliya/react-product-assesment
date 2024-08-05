import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schemas/order.schema";
import { Coupon, CouponSchema } from "src/coupon/schema/coupon.schema";
import {
  ProductEntries,
  ProductEntriesSchema,
} from "src/products/schemas/product-entries.schema";
import { Users, UsersSchema } from "src/users/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    MongooseModule.forFeature([
      { name: ProductEntries.name, schema: ProductEntriesSchema },
    ]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";
import {
  ProductEntries,
  ProductEntriesSchema,
} from "./schemas/product-entries.schema";
import { Color, ColorSchema } from "src/colors/schema/color.schema";
import { Coupon, CouponSchema } from "src/coupon/schema/coupon.schema";
import { Size, SizeSchema } from "src/sizes/schema/size.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductEntries.name, schema: ProductEntriesSchema },
    ]),
    MongooseModule.forFeature([{ name: Size.name, schema: SizeSchema }]),
    MongooseModule.forFeature([{ name: Color.name, schema: ColorSchema }]),
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {
  constructor(private readonly productsService: ProductsService) {}
  async onModuleInit(): Promise<void> {
    await this.productsService.createInitialProductEntries();
  }
}

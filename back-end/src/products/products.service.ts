import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, PipelineStage } from "mongoose";
import { Color, ColorDocument } from "src/colors/schema/color.schema";
import {
  productSizes,
  productColor,
  productCoupons,
  products,
} from "src/common/constants/product.constants";
import { Size, SizeDocument } from "src/sizes/schema/size.schema";
import {
  ProductEntries,
  ProductEntriesDocument,
} from "./schemas/product-entries.schema";
import { Product, ProductDocument } from "./schemas/product.schema";
import { Coupon, CouponDocument } from "src/coupon/schema/coupon.schema";
import { statusBadRequest } from "src/common/constants/response.status.constant";
import { AuthExceptions } from "src/common/helpers/exceptions";
import { PRODUCT_NOT_EXIST } from "src/common/constants/response.constants";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductEntries.name)
    private productEntriesModel: Model<ProductEntriesDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Size.name)
    private sizeModel: Model<SizeDocument>,
    @InjectModel(Color.name)
    private colorModel: Model<ColorDocument>,
    @InjectModel(Coupon.name)
    private couponModel: Model<CouponDocument>,
  ) {}

  async createInitialProductEntries() {
    const productCount = await this.productModel.countDocuments({});
    const sizeCount = await this.sizeModel.countDocuments({});
    const colorCount = await this.colorModel.countDocuments({});
    const couponCount = await this.couponModel.countDocuments({});
    const productEntriesCount = await this.productEntriesModel.countDocuments(
      {},
    );

    if (
      productCount === 0 &&
      sizeCount === 0 &&
      colorCount === 0 &&
      couponCount === 0 &&
      productEntriesCount === 0
    ) {
      const sizes = productSizes;
      const colors = productColor;
      const coupon = productCoupons;

      const sizeDocs = await this.sizeModel.insertMany(
        sizes.map((size) => ({ name: size.name, sequence: size.sequence })),
      );
      const colorDocs = await this.colorModel.insertMany(
        colors.map((name) => ({ name })),
      );

      await this.couponModel.insertMany(coupon);

      const speaker = await this.productModel.create(products[1]);

      const headPhone = await this.productModel.create(products[0]);

      const priceChart1 = {
        Red: [20, 30, 40, 50, 60],
        Blue: [70, 80, 90, 100, 110],
        White: [120, 130, 140, null, null],
        Black: [150, 160, 170, 180, null],
      };

      const priceChart2 = {
        White: [100, 200, null],
        Black: [null, 300, 400],
      };

      const entries1 = [];

      for (const [color, prices] of Object.entries(priceChart1)) {
        const colorId = colorDocs.find((c) => c.name === color)._id;
        for (let i = 0; i < prices.length; i++) {
          const price = prices[i];
          if (price !== null) {
            const sizeId = sizeDocs[i]._id;
            entries1.push({ productId: speaker._id, sizeId, colorId, price });
          }
        }
      }

      await this.productEntriesModel.insertMany(entries1);

      const entries2 = [];

      for (const [color, prices] of Object.entries(priceChart2)) {
        const colorId = colorDocs.find((c) => c.name === color)._id;
        for (let i = 0; i < prices.length; i++) {
          const price = prices[i];
          if (price !== null) {
            const sizeId = sizeDocs[i]._id;
            entries2.push({ productId: headPhone._id, sizeId, colorId, price });
          }
        }
      }

      await this.productEntriesModel.insertMany(entries2);
      console.log("Database seeded!");
    } else {
      console.log("Database already contains data, seeding skipped");
    }
  }

  async findAllProduct() {
    try {
      const productList = await this.productModel.find();
      return productList;
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async getProductDetails(productId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(productId);

      // Check if the product exists
      const isProductExist = await this.productEntriesModel.findOne({
        productId: objectId,
      });
      if (!isProductExist) {
        throw AuthExceptions.customException(
          PRODUCT_NOT_EXIST,
          statusBadRequest,
        );
      }

      // Define aggregate query
      const aggregateQuery: PipelineStage[] = [
        { $match: { productId: objectId } },

        // Perform lookups
        this.createLookupStage("products", "productId", "_id", "productData"),
        this.createLookupStage("sizes", "sizeId", "_id", "productSize"),
        this.createLookupStage("colors", "colorId", "_id", "productColor"),

        // Group by size
        {
          $group: {
            _id: "$productSize._id",
            productId: { $first: "$productId" },
            productName: { $first: "$productData.name" },
            productDescription: { $first: "$productData.description" },
            productRate: { $first: "$productData.rate" },
            productImage: { $first: "$productData.image" },
            size: { $first: "$productSize.name" },
            productSize: { $first: "$productSize" },
            colorAndPriceArray: {
              $push: {
                color: "$productColor.name",
                colorId: "$productColor._id",
                price: "$price",
                productEntryId: "$_id",
              },
            },
          },
        },
        { $sort: { "productSize.sequence": 1 } },

        // Group by product
        {
          $group: {
            _id: null,
            productId: { $first: "$productId" },
            productName: { $first: "$productName" },
            productDescription: { $first: "$productDescription" },
            productRate: { $first: "$productRate" },
            productImage: { $first: "$productImage" },
            sizeWiseColorPriceArray: {
              $push: {
                _id: "$_id",
                size: "$size",
                colorAndSizeArray: "$colorAndPriceArray",
              },
            },
          },
        },
      ];

      // Execute aggregation
      const productDetails =
        await this.productEntriesModel.aggregate(aggregateQuery);
      return productDetails[0];
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  private createLookupStage(
    from: string,
    localField: string,
    foreignField: string,
    as: string,
  ): PipelineStage {
    return {
      $lookup: {
        from,
        localField,
        foreignField,
        as,
      },
    };
  }
}

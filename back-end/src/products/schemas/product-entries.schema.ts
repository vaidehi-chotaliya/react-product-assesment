import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProductEntriesDocument = ProductEntries & Document;

@Schema({ collection: "productEntries", timestamps: true })
export class ProductEntries {
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  sizeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  colorId: Types.ObjectId;

  @Prop({ required: true })
  price: number;
}

export const ProductEntriesSchema =
  SchemaFactory.createForClass(ProductEntries);

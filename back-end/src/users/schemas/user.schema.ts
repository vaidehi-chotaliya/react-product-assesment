import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UsersDocument = Users & Document;

@Schema({ collection: "users", timestamps: true })
export class Users {
  @Prop({ required: true, unique: true, index: true })
  email: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

import { Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UsersSchema } from "./schemas/user.schema";
import { LoggerModule } from "src/common/logger/logger.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),

    LoggerModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class UsersModule implements OnModuleInit {
  constructor() {}

  async onModuleInit(): Promise<void> {}
}

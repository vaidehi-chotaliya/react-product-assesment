import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { LoggerModule } from "./common/logger/logger.module";
import { DatabaseModule } from "./providers/database/mongo/database.module";
import AppConfiguration from "./config/app.config";
import DatabaseConfiguration from "./config/database.config";
import AuthConfiguration from "./config/auth.config";
import { ProductsModule } from "./products/products.module";
import { ColorsModule } from "./colors/colors.module";
import { SizesModule } from "./sizes/sizes.module";
import { CouponModule } from "./coupon/coupon.module";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration, DatabaseConfiguration, AuthConfiguration],
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    DatabaseModule,
    LoggerModule,
    UsersModule,
    ProductsModule,
    SizesModule,
    ColorsModule,
    CouponModule,
    OrderModule,
  ],
  providers: [],
})
export class AppModule {}

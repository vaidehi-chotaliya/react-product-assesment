import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  PRODUCT_DETAILS,
  PRODUCT_LIST,
} from "src/common/constants/response.constants";
import { statusOk } from "src/common/constants/response.status.constant";
import { ResponseMessage } from "src/common/decorators/response.decorator";

@Controller("products")
@ApiTags("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get("/list")
  @ApiOperation({
    summary: "Product list api",
  })
  @ResponseMessage(PRODUCT_LIST)
  @HttpCode(statusOk)
  async getProductList() {
    return await this.productsService.findAllProduct();
  }

  @Get("detail/:productId")
  @ApiOperation({
    summary: "Get product details api",
  })
  @ResponseMessage(PRODUCT_DETAILS)
  async getProductDetails(@Param("productId") productId: string) {
    return await this.productsService.getProductDetails(productId);
  }
}

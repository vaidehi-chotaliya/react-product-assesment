import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonService {
  constructor() {}

  async getSettings(): Promise<any> {
    return {};
  }
}

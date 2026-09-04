import { IApi } from "../../types";
import {
  IProductListResponse,
  IOrderPayload,
  IOrderResponse,
} from "../../types";

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  /**
   * Получает список товаров с сервера.
   */
  async getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>("/product/");
  }

  /**
   * Отправляет заказ на сервер.
   * @param payload Данные заказа (товары + покупатель)
   */
  async sendOrder(payload: IOrderPayload): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", payload);
  }
}

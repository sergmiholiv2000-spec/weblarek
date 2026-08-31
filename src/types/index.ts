export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Теперь тип ошибок зависит от IBuyer и автоматически обновляется при изменении полей
export type IBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

// Ответ сервера на GET /product/
export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

// Данные, которые реально отправляет клиент при оформлении заказа (по контракту из Postman)
export interface IOrderPayload {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // массив ID товаров, как в примере запроса
}

// Ответ сервера после POST /order/
export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}
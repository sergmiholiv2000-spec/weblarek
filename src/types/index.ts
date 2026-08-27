export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

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

export interface IBuyerValidationErrors {
  [key: string]: string;
}

// Ответ сервера на GET /product/
export interface IProductsResponse {
  items: IProduct[];
}

// Данные, которые отправляем на сервер при оформлении заказа
export interface IOrderPayload {
  products: IProduct[];
  buyer: IBuyer;
}

// Ответ сервера после POST /order/
export interface IOrderResponse {
  total: number;
  orderId: string;
  message: string;
}

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

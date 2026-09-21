/* Базовые типы */

export type TApiPostMethod = "POST" | "PUT" | "DELETE";

export type TPayment = "card" | "cash";

export type TModalContent =
  | "none"
  | "product"
  | "basket"
  | "order"
  | "contacts"
  | "success";

export type TTemplateName =
  | "catalogCard"
  | "previewCard"
  | "basketCard"
  | "basket"
  | "orderForm"
  | "contactsForm"
  | "success";

export interface ITemplateDescriptor {
  id: string;
  root: string;
}

/* Данные предметной области */

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

/* Контракты сервера */

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderPayload extends Omit<IBuyer, "payment"> {
  payment: TPayment;
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: TApiPostMethod,
  ): Promise<T>;
}

export interface IApiService {
  getProducts(): Promise<IProductListResponse>;
  sendOrder(payload: IOrderPayload): Promise<IOrderResponse>;
}

/* Контракты моделей */

export interface IProductsModel {
  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getItemById(id: string): IProduct | undefined;
  setSelectedProduct(product: IProduct | null): void;
  getSelectedProduct(): IProduct | null;
}

export interface ICartModel {
  getItems(): IProduct[];
  addItem(product: IProduct): void;
  removeItem(id: string): void;
  clear(): void;
  getTotalPrice(): number;
  getCount(): number;
  hasItem(id: string): boolean;
}

export interface IBuyerModel {
  setData(data: Partial<IBuyer>): void;
  getData(): IBuyer;
  clear(): void;
  validate(): TBuyerValidationErrors;
}

/* Полезные нагрузки событий */

export interface IProductIdPayload {
  id: string;
}

export interface IFormFieldPayload {
  field: string;
  value: string;
}

/* Состояния компонентов представления */

export interface IPageState {
  catalog: HTMLElement[];
  counter: number;
  locked: boolean;
}

export interface IModalState {
  content: HTMLElement;
}

export interface ICardState {
  title: string;
  price: number | null;
}

export interface ICatalogCardState extends ICardState {
  category: string;
  image: string;
}

export interface IPreviewCardState extends ICatalogCardState {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export interface IBasketCardState extends ICardState {
  index: number;
}

export interface IBasketState {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export interface IFormState {
  valid: boolean;
  errors: string;
}

export interface IOrderFormState extends IFormState {
  payment: TPayment | null;
  address: string;
}

export interface IContactsFormState extends IFormState {
  email: string;
  phone: string;
}

export interface ISuccessState {
  total: number;
}

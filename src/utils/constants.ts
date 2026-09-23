import { ITemplateDescriptor, TPayment, TTemplateName } from "../types";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN as string;

export const API_URL = `${API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;

export const API_ENDPOINTS = {
  products: "/product/",
  order: "/order/",
};

export const categoryMap: Record<string, string> = {
  "софт-скил": "card__category_soft",
  другое: "card__category_other",
  дополнительное: "card__category_additional",
  кнопка: "card__category_button",
  "хард-скил": "card__category_hard",
};

export const CATEGORY_BASE_CLASS = "card__category";
export const CATEGORY_DEFAULT_MODIFIER = "card__category_other";

export const ROOT_SELECTORS = {
  page: ".page",
  modal: "#modal-container",
};

export const TEMPLATES: Record<TTemplateName, ITemplateDescriptor> = {
  catalogCard: { id: "card-catalog", root: ".card" },
  previewCard: { id: "card-preview", root: ".card" },
  basketCard: { id: "card-basket", root: ".basket__item" },
  basket: { id: "basket", root: ".basket" },
  orderForm: { id: "order", root: ".form" },
  contactsForm: { id: "contacts", root: ".form" },
  success: { id: "success", root: ".order-success" },
};

export const MODIFIERS = {
  modalActive: "modal_active",
  pageLocked: "page__wrapper_locked",
  paymentActive: "button_alt-active",
};

export const EVENTS = {
  catalogChanged: "catalog:changed",
  productSelected: "product:selected",
  cartChanged: "cart:changed",
  buyerChanged: "buyer:changed",
  productSelect: "product:select",
  productAction: "product:action",
  basketOpen: "basket:open",
  cartRemove: "cart:remove",
  orderOpen: "order:open",
  orderChange: "order:change",
  orderNext: "order:next",
  contactsChange: "contacts:change",
  orderPay: "order:pay",
  modalClose: "modal:close",
};

export const FORM_FIELDS = {
  payment: "payment",
  address: "address",
  email: "email",
  phone: "phone",
};

export const PAYMENT_METHODS: readonly TPayment[] = ["card", "cash"];

export const TEXTS = {
  currency: "синапсов",
  priceless: "Бесценно",
  buy: "Купить",
  removeFromCart: "Удалить из корзины",
  unavailable: "Недоступно",
  emptyBasket: "Корзина пуста",
  successTotal: "Списано",
  orderError: "Не удалось оформить заказ. Попробуйте ещё раз",
};

export const VALIDATION_MESSAGES = {
  payment: "Не выбран вид оплаты",
  address: "Укажите адрес доставки",
  email: "Укажите email",
  phone: "Укажите телефон",
};

export const ERROR_SEPARATOR = ". ";

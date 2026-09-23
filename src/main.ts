import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";

import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { Products } from "./components/models/Products";

import { ApiService } from "./components/services/ApiService";

import { Basket } from "./components/view/Basket";
import { BasketCard, CatalogCard, PreviewCard } from "./components/view/Card";
import { ContactsForm } from "./components/view/ContactsForm";
import { Modal } from "./components/view/Modal";
import { OrderForm } from "./components/view/OrderForm";
import { Page } from "./components/view/Page";
import { Success } from "./components/view/Success";

import {
  IBasketState,
  IBuyer,
  IFormFieldPayload,
  IOrderPayload,
  IPreviewCardState,
  IProduct,
  IProductIdPayload,
  IProductListResponse,
  TPayment,
} from "./types";

import {
  API_URL,
  ERROR_SEPARATOR,
  EVENTS,
  FORM_FIELDS,
  PAYMENT_METHODS,
  ROOT_SELECTORS,
  TEMPLATES,
  TEXTS,
} from "./utils/constants";

import { cloneTemplate, ensureElement } from "./utils/utils";

const ORDER_FIELDS: Array<keyof IBuyer> = ["payment", "address"];
const CONTACTS_FIELDS: Array<keyof IBuyer> = ["email", "phone"];

const events = new EventEmitter();
const apiService = new ApiService(new Api(API_URL));

const productsModel = new Products(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const page = new Page(ensureElement<HTMLElement>(ROOT_SELECTORS.page), () =>
  events.emit(EVENTS.basketOpen),
);

const modal = new Modal(ensureElement<HTMLElement>(ROOT_SELECTORS.modal), () =>
  events.emit(EVENTS.modalClose),
);

const basketView = new Basket(cloneTemplate(TEMPLATES.basket), () =>
  events.emit(EVENTS.orderOpen),
);

const previewCard = new PreviewCard(cloneTemplate(TEMPLATES.previewCard), () =>
  events.emit(EVENTS.productAction),
);

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>(TEMPLATES.orderForm),
  () => events.emit(EVENTS.orderNext),
  (field, value) =>
    events.emit<IFormFieldPayload>(EVENTS.orderChange, { field, value }),
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>(TEMPLATES.contactsForm),
  () => events.emit(EVENTS.orderPay),
  (field, value) =>
    events.emit<IFormFieldPayload>(EVENTS.contactsChange, { field, value }),
);

const successView = new Success(cloneTemplate(TEMPLATES.success), () =>
  events.emit(EVENTS.modalClose),
);

function openModal(content: HTMLElement): void {
  modal.render({ content });
  modal.open();
  page.render({ locked: true });
}

function closeModal(): void {
  modal.close();
  page.render({ locked: false });
}

function isPayment(value: string): value is TPayment {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}

function collectErrors(fields: Array<keyof IBuyer>): string {
  const errors = buyer.validate();

  return fields
    .map((field) => errors[field])
    .filter(Boolean)
    .join(ERROR_SEPARATOR);
}

function getButtonText(product: IProduct): string {
  if (product.price === null) {
    return TEXTS.unavailable;
  }

  return cart.hasItem(product.id) ? TEXTS.removeFromCart : TEXTS.buy;
}

function getPreviewState(product: IProduct): IPreviewCardState {
  return {
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    buttonText: getButtonText(product),
    buttonDisabled: product.price === null,
  };
}

function getBasketState(): IBasketState {
  const items = cart.getItems().map((product, index) => {
    const card = new BasketCard(cloneTemplate(TEMPLATES.basketCard), () =>
      events.emit<IProductIdPayload>(EVENTS.cartRemove, { id: product.id }),
    );

    return card.render({
      index: index + 1,
      title: product.title,
      price: product.price,
    });
  });

  return {
    items,
    total: cart.getTotalPrice(),
    buttonDisabled: cart.getCount() === 0,
  };
}

/*
 * Обработка событий моделей
 */

events.on(EVENTS.catalogChanged, () => {
  const cards = productsModel.getItems().map((product) => {
    const card = new CatalogCard(cloneTemplate(TEMPLATES.catalogCard), () =>
      events.emit<IProductIdPayload>(EVENTS.productSelect, { id: product.id }),
    );

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
    });
  });

  page.render({ catalog: cards });
});

events.on(EVENTS.productSelected, () => {
  const product = productsModel.getSelectedProduct();

  if (!product) {
    return;
  }

  openModal(previewCard.render(getPreviewState(product)));
});

events.on(EVENTS.cartChanged, () => {
  page.render({ counter: cart.getCount() });
  basketView.render(getBasketState());
});

events.on(EVENTS.buyerChanged, () => {
  const data = buyer.getData();
  const orderErrors = collectErrors(ORDER_FIELDS);
  const contactsErrors = collectErrors(CONTACTS_FIELDS);

  orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: orderErrors === "",
    errors: orderErrors,
  });

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: contactsErrors === "",
    errors: contactsErrors,
  });
});

/*
 * Обработка событий представлений
 */

events.on<IProductIdPayload>(EVENTS.productSelect, ({ id }) => {
  const product = productsModel.getItemById(id);

  if (product) {
    productsModel.setSelectedProduct(product);
  }
});

events.on(EVENTS.productAction, () => {
  const product = productsModel.getSelectedProduct();

  if (!product) {
    return;
  }

  if (cart.hasItem(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }

  closeModal();
  productsModel.setSelectedProduct(null);
});

events.on(EVENTS.basketOpen, () => {
  openModal(basketView.render(getBasketState()));
});

events.on<IProductIdPayload>(EVENTS.cartRemove, ({ id }) => {
  cart.removeItem(id);
});

events.on(EVENTS.orderOpen, () => {
  openModal(orderForm.render());
});

events.on<IFormFieldPayload>(EVENTS.orderChange, ({ field, value }) => {
  if (field === FORM_FIELDS.address) {
    buyer.setData({ address: value });
  }

  if (field === FORM_FIELDS.payment && isPayment(value)) {
    buyer.setData({ payment: value });
  }
});

events.on(EVENTS.orderNext, () => {
  openModal(contactsForm.render());
});

events.on<IFormFieldPayload>(EVENTS.contactsChange, ({ field, value }) => {
  if (field === FORM_FIELDS.email) {
    buyer.setData({ email: value });
  }

  if (field === FORM_FIELDS.phone) {
    buyer.setData({ phone: value });
  }
});

events.on(EVENTS.orderPay, () => {
  const { payment, email, phone, address } = buyer.getData();

  // Сужение типа: в заказе способ оплаты обязателен
  if (!payment) {
    return;
  }

  const payload: IOrderPayload = {
    payment,
    email,
    phone,
    address,
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
  };

  apiService
    .sendOrder(payload)
    .then((response) => {
      openModal(successView.render({ total: response.total }));
      cart.clear();
      buyer.clear();
    })
    .catch(() => {
      contactsForm.render({ valid: false, errors: TEXTS.orderError });
    });
});

events.on(EVENTS.modalClose, () => {
  closeModal();
  productsModel.setSelectedProduct(null);
});

/*
 * Инициализация
 */

page.render({ counter: cart.getCount(), locked: false });

apiService
  .getProducts()
  .then((response: IProductListResponse) => {
    productsModel.setItems(response.items);
  })
  .catch(() => {
    page.render({ catalog: [] });
  });

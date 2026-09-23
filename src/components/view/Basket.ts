import { IBasketState } from "../../types";
import { TEXTS } from "../../utils/constants";
import { ensureElement, formatPrice } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Корзина товаров.
 */
export class Basket extends Component<IBasketState> {
  private readonly listElement: HTMLElement;
  private readonly totalElement: HTMLElement;
  private readonly orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, onOrder: () => void) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(".basket__list", container);
    this.totalElement = ensureElement<HTMLElement>(".basket__price", container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.orderButton.addEventListener("click", onOrder);
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.classList.add("basket__empty");
      emptyItem.textContent = TEXTS.emptyBasket;

      this.listElement.replaceChildren(emptyItem);
      return;
    }

    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.totalElement.textContent = formatPrice(value);
  }

  set buttonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}

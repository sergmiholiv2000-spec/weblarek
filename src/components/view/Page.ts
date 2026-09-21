import { IPageState } from "../../types";
import { MODIFIERS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Главная страница приложения.
 */
export class Page extends Component<IPageState> {
  private readonly gallery: HTMLElement;
  private readonly basketCounter: HTMLElement;
  private readonly basketButton: HTMLButtonElement;
  private readonly wrapper: HTMLElement;

  constructor(container: HTMLElement, onBasketClick: () => void) {
    super(container);

    this.gallery = ensureElement<HTMLElement>(".gallery", container);
    this.wrapper = ensureElement<HTMLElement>(".page__wrapper", container);
    this.basketCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );

    this.basketButton.addEventListener("click", onBasketClick);
  }

  set catalog(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }

  set locked(value: boolean) {
    this.wrapper.classList.toggle(MODIFIERS.pageLocked, value);
  }
}
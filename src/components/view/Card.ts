import {
  IBasketCardState,
  ICardState,
  ICatalogCardState,
  IPreviewCardState,
} from "../../types";
import {
  CATEGORY_BASE_CLASS,
  CATEGORY_DEFAULT_MODIFIER,
  CDN_URL,
  categoryMap,
} from "../../utils/constants";
import { ensureElement, formatPrice } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Общий родитель всех карточек.
 */
export abstract class Card<T extends ICardState> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(".card__title", container);
    this.priceElement = ensureElement<HTMLElement>(".card__price", container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = formatPrice(value);
  }
}

/**
 * Карточка с изображением и категорией товара.
 */
export abstract class ProductCard<
  T extends ICatalogCardState,
> extends Card<T> {
  protected readonly categoryElement: HTMLElement;
  protected readonly imageElement: HTMLImageElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = CATEGORY_BASE_CLASS;
    this.categoryElement.classList.add(
      categoryMap[value] ?? CATEGORY_DEFAULT_MODIFIER,
    );
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`);
  }

  render(data?: Partial<T>): HTMLElement {
    const element = super.render(data);
    this.imageElement.alt = this.titleElement.textContent ?? "";

    return element;
  }
}

/**
 * Карточка товара в каталоге.
 */
export class CatalogCard extends ProductCard<ICatalogCardState> {
  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.container.addEventListener("click", onClick);
  }
}

/**
 * Подробная карточка товара.
 */
export class PreviewCard extends ProductCard<IPreviewCardState> {
  private readonly descriptionElement: HTMLElement;
  private readonly buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, onAction: () => void) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buttonElement.addEventListener("click", onAction);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}

/**
 * Карточка товара в корзине.
 */
export class BasketCard extends Card<IBasketCardState> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this.deleteButton.addEventListener("click", onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
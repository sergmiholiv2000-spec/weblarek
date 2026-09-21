import { ICartModel, IProduct } from "../../types";
import { EVENTS } from "../../utils/constants";
import { IEvents } from "../base/Events";

/**
 * Управляет составом корзины.
 */
export class Cart implements ICartModel {
  private items: IProduct[] = [];

  constructor(private readonly events: IEvents) {}

  /** Возвращает копию массива товаров корзины. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Добавляет товар, если его ещё нет в корзине. */
  addItem(product: IProduct): void {
    if (this.hasItem(product.id)) {
      return;
    }

    this.items.push(product);
    this.events.emit(EVENTS.cartChanged);
  }

  /** Удаляет товар по идентификатору. */
  removeItem(id: string): void {
    const previousCount = this.items.length;

    this.items = this.items.filter((item) => item.id !== id);

    if (this.items.length !== previousCount) {
      this.events.emit(EVENTS.cartChanged);
    }
  }

  /** Очищает корзину. */
  clear(): void {
    this.items = [];
    this.events.emit(EVENTS.cartChanged);
  }

  /** Возвращает суммарную стоимость товаров. */
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  /** Возвращает количество товаров. */
  getCount(): number {
    return this.items.length;
  }

  /** Проверяет наличие товара в корзине. */
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
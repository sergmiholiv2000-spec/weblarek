import { IProduct, IProductsModel } from "../../types";
import { EVENTS } from "../../utils/constants";
import { IEvents } from "../base/Events";

/**
 * Хранит каталог товаров и товар, выбранный для просмотра.
 */
export class Products implements IProductsModel {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private readonly events: IEvents) {}

  /** Сохраняет каталог товаров. */
  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit(EVENTS.catalogChanged);
  }

  /** Возвращает копию массива товаров каталога. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Возвращает товар по идентификатору. */
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  /** Сохраняет товар для подробного просмотра либо сбрасывает выбор. */
  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.events.emit(EVENTS.productSelected);
  }

  /** Возвращает выбранный товар. */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
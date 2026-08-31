import { IProduct } from "../types";

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    // Используем готовый метод hasItem — так код чище и нет дублирования логики
    if (!this.hasItem(product.id)) {
      this.items.push(product);
    }
  }

  removeItem(product: IProduct): void {
    this.hasItem(product.id);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.price ?? 0);
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}

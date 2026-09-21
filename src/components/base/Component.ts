/**
 * Базовый компонент представления.
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {}

  /** Установить изображение с альтернативным текстом. */
  protected setImage(
    element: HTMLImageElement,
    src: string,
    alt?: string,
  ): void {
    element.src = src;

    if (alt) {
      element.alt = alt;
    }
  }

  /** Записать данные в сеттеры и вернуть корневой элемент. */
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}
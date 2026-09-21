import { IModalState } from "../../types";
import { MODIFIERS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Модальное окно. Содержимое передаётся готовым компонентом.
 */
export class Modal extends Component<IModalState> {
  private readonly contentElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );

    this.closeButton.addEventListener("click", onClose);

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        onClose();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  /** Показывает окно. */
  open(): void {
    this.container.classList.add(MODIFIERS.modalActive);
  }

  /** Скрывает окно и очищает его содержимое. */
  close(): void {
    this.container.classList.remove(MODIFIERS.modalActive);
    this.contentElement.replaceChildren();
  }
}
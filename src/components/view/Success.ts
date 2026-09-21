import { ISuccessState } from "../../types";
import { TEXTS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Сообщение об успешном оформлении заказа.
 */
export class Success extends Component<ISuccessState> {
  private readonly totalElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);

    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );

    this.closeButton.addEventListener("click", onClose);
  }

  set total(value: number) {
    this.totalElement.textContent = `${TEXTS.successTotal} ${value} ${TEXTS.currency}`;
  }
}
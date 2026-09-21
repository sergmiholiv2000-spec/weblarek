import { IFormState } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

/**
 * Общий родитель форм оформления заказа.
 */
export abstract class Form<T extends IFormState> extends Component<T> {
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;

  protected constructor(
    container: HTMLFormElement,
    onSubmit: () => void,
    onChange: (field: string, value: string) => void,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );
    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      onSubmit();
    });

    this.container.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;

      if (target.name) {
        onChange(target.name, target.value);
      }
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
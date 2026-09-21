import { IOrderFormState, TPayment } from "../../types";
import { FORM_FIELDS, MODIFIERS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";

/**
 * Первый шаг оформления заказа.
 */
export class OrderForm extends Form<IOrderFormState> {
  private readonly addressInput: HTMLInputElement;
  private readonly paymentButtons: HTMLButtonElement[];

  constructor(
    container: HTMLFormElement,
    onSubmit: () => void,
    onChange: (field: string, value: string) => void,
  ) {
    super(container, onSubmit, onChange);

    this.addressInput = ensureElement<HTMLInputElement>(
      `[name="${FORM_FIELDS.address}"]`,
      container,
    );

    this.paymentButtons = Array.from(
      container.querySelectorAll<HTMLButtonElement>(".order__buttons .button"),
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        onChange(FORM_FIELDS.payment, button.name);
      });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle(
        MODIFIERS.paymentActive,
        button.name === value,
      );
    });
  }
}
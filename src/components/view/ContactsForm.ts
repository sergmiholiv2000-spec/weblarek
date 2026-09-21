import { IContactsFormState } from "../../types";
import { FORM_FIELDS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";

/**
 * Второй шаг оформления заказа.
 */
export class ContactsForm extends Form<IContactsFormState> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onSubmit: () => void,
    onChange: (field: string, value: string) => void,
  ) {
    super(container, onSubmit, onChange);

    this.emailInput = ensureElement<HTMLInputElement>(
      `[name="${FORM_FIELDS.email}"]`,
      container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      `[name="${FORM_FIELDS.phone}"]`,
      container,
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
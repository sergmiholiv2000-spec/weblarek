import { IBuyer, IBuyerModel, TBuyerValidationErrors, TPayment } from "../../types";
import { EVENTS, VALIDATION_MESSAGES } from "../../utils/constants";
import { IEvents } from "../base/Events";

/**
 * Хранит и валидирует данные покупателя.
 */
export class Buyer implements IBuyerModel {
  private payment: TPayment | null = null;
  private email = "";
  private phone = "";
  private address = "";

  constructor(private readonly events: IEvents) {}

  /** Обновляет отдельные поля, не сбрасывая остальные. */
  setData(data: Partial<IBuyer>): void {
    let changed = false;

    if (data.payment !== undefined && data.payment !== this.payment) {
      this.payment = data.payment;
      changed = true;
    }

    if (data.email !== undefined && data.email !== this.email) {
      this.email = data.email;
      changed = true;
    }

    if (data.phone !== undefined && data.phone !== this.phone) {
      this.phone = data.phone;
      changed = true;
    }

    if (data.address !== undefined && data.address !== this.address) {
      this.address = data.address;
      changed = true;
    }

    if (changed) {
      this.events.emit(EVENTS.buyerChanged);
    }
  }

  /** Возвращает все данные покупателя. */
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  /** Очищает данные покупателя. */
  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";

    this.events.emit(EVENTS.buyerChanged);
  }

  /** Проверяет заполненность полей. */
  validate(): TBuyerValidationErrors {
    const errors: TBuyerValidationErrors = {};

    if (!this.payment) {
      errors.payment = VALIDATION_MESSAGES.payment;
    }

    if (!this.address) {
      errors.address = VALIDATION_MESSAGES.address;
    }

    if (!this.email) {
      errors.email = VALIDATION_MESSAGES.email;
    }

    if (!this.phone) {
      errors.phone = VALIDATION_MESSAGES.phone;
    }

    return errors;
  }
}
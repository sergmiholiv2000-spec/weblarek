import {
  IBuyer,
  IBuyerModel,
  TBuyerValidationErrors,
  TPayment,
} from "../../types";
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
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    this.events.emit(EVENTS.buyerChanged);
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

import { TPayment, IBuyer, IBuyerValidationErrors } from "../types";

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  // Можно обновлять отдельные поля, не сбрасывая остальные
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  getData(): IBuyer | string | null {
    // Возвращаем null, если хотя бы одно поле не заполнено — опционально, по желанию
    if (!this.payment || !this.email || !this.phone || !this.address) {
      return null;
    }
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  validate(): IBuyerValidationErrors  {
    const errors: IBuyerValidationErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.email) {
      errors.email = "Укажите email";
    }
    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this.address) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }
}

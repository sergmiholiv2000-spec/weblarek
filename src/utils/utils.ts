import { ITemplateDescriptor } from "../types";
import { TEXTS } from "./constants";

export function ensureElement<T extends HTMLElement>(
  selector: string,
  container: ParentNode = document,
): T {
  const element = container.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Элемент "${selector}" не найден`);
  }

  return element;
}

export function cloneTemplate<T extends HTMLElement>(
  descriptor: ITemplateDescriptor,
): T {
  const template = ensureElement<HTMLTemplateElement>(`#${descriptor.id}`);
  const element = ensureElement<T>(descriptor.root, template.content);

  return element.cloneNode(true) as T;
}

export function formatPrice(price: number | null): string {
  return price === null ? TEXTS.priceless : `${price} ${TEXTS.currency}`;
}
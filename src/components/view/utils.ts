export function cloneTemplate(
  templateId: string,
  selector: string,
): HTMLElement {
  const template = document.querySelector<HTMLTemplateElement>(
    `#${templateId}`,
  );

  if (!template) {
    throw new Error(`Шаблон "${templateId}" не найден`);
  }

  const element = template.content.querySelector<HTMLElement>(selector);

  if (!element) {
    throw new Error(
      `Элемент "${selector}" не найден в шаблоне "${templateId}"`,
    );
  }

  return element.cloneNode(true) as HTMLElement;
}

export function formatPrice(price: number | null): string {
  return price === null ? "Бесценно" : `${price} синапсов`;
}

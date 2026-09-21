# Проектная работа «Веб-ларёк»

Интернет-магазин товаров для веб-разработчиков. Пользователь просматривает каталог, открывает подробную карточку това��а, добавляет товары в корзину, удаляет их и оформляет заказ в две формы.

Стек: HTML, SCSS, TypeScript, Vite.

## Установка и запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Структура проекта

```text
src/
├── components/
│   ├── base/          # Component, Api, EventEmitter
│   ├── models/        # Products, Cart, Buyer
│   ├── services/      # ApiService
│   └── view/          # Компоненты представления
├── images/
├── scss/
├── types/
│   └── index.ts       # Все типы и интерфейсы приложения
├── utils/
│   ├── constants.ts   # Константы приложения
│   └── utils.ts       # Вспомогательные функции
└── main.ts            # Точка входа и презентер
```

Важные файлы:

- `index.html` — разметка страницы и HTML-шаблоны компонентов;
- `src/main.ts` — точка входа приложения и презентер;
- `src/types/index.ts` — типы данных;
- `src/utils/constants.ts` — адреса API, идентификаторы шаблонов, имена событий, CSS-модификаторы, тексты интерфейса;
- `src/utils/utils.ts` — функции `ensureElement`, `cloneTemplate`, `formatPrice`;
- `src/scss/styles.scss` — корневой файл стилей.

## Архитектура приложения

Код разделён по паттерну **MVP**:

- **Model** — хранит и изменяет данные приложения, ничего не знает о разметке;
- **View** — отображает интерфейс и сообщает о действиях пользователя, не хранит данные и не содержит логики;
- **Presenter** — связывает модели и представления, обрабатывая события;
- **EventEmitter** — брокер событий, через который взаимодействуют слои.

Презентер реализован в `src/main.ts`, отдельный класс не создаётся: у приложения одна страница, поэтому достаточно одного презентера.

### Взаимодействие слоёв

1. Пользователь взаимодействует с компонентом View.
2. Компонент вызывает обработчик, полученный в конструкторе.
3. Обработчик генерирует событие через `EventEmitter`.
4. Презентер обрабатывает событие и вызывает метод модели.
5. Модель изменяет данные и генерирует событие изменения.
6. Презентер получает данные из модели, подготавливает их и передаёт в компонент View.

Разметка перерисовывается только в двух случаях: при обработке события от модели и при открытии модального окна.

## Типы данных

Все типы объявлены в `src/types/index.ts`.

### Базовые типы

```ts
type TApiPostMethod = "POST" | "PUT" | "DELETE";

type TPayment = "card" | "cash";

type TModalContent =
  | "none"
  | "product"
  | "basket"
  | "order"
  | "contacts"
  | "success";

type TTemplateName =
  | "catalogCard"
  | "previewCard"
  | "basketCard"
  | "basket"
  | "orderForm"
  | "contactsForm"
  | "success";

interface ITemplateDescriptor {
  id: string;
  root: string;
}
```

- `TPayment` — способ оплаты: `card` для онлайн-оплаты, `cash` для оплаты при получении;
- `TModalContent` — вид содержимого, открытого в модальном окне, используется презентером;
- `ITemplateDescriptor` — идентификатор HTML-шаблона и селектор его корневого элемента.

### Данные предметной области

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;
```

Если `price` равно `null`, товар нельзя добавить в корзину. `TBuyerValidationErrors` содержит сообщения об ошибках для тех полей покупателя, которые не прошли валидацию, пустой объект означает отсутствие ошибок.

### Контракты сервера

```ts
interface IProductListResponse {
  total: number;
  items: IProduct[];
}

interface IOrderPayload extends Omit<IBuyer, "payment"> {
  payment: TPayment;
  total: number;
  items: string[];
}

interface IOrderResponse {
  id: string;
  total: number;
}

interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: TApiPostMethod,
  ): Promise<T>;
}

interface IApiService {
  getProducts(): Promise<IProductListResponse>;
  sendOrder(payload: IOrderPayload): Promise<IOrderResponse>;
}
```

`IOrderPayload` получен из `IBuyer` через `Omit`: способ оплаты в заказе обязателен, поэтому `null` в нём недопустим.

### Контракты моделей

```ts
interface IProductsModel {
  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getItemById(id: string): IProduct | undefined;
  setSelectedProduct(product: IProduct | null): void;
  getSelectedProduct(): IProduct | null;
}

interface ICartModel {
  getItems(): IProduct[];
  addItem(product: IProduct): void;
  removeItem(id: string): void;
  clear(): void;
  getTotalPrice(): number;
  getCount(): number;
  hasItem(id: string): boolean;
}

interface IBuyerModel {
  setData(data: Partial<IBuyer>): void;
  getData(): IBuyer;
  clear(): void;
  validate(): TBuyerValidationErrors;
}
```

Интерфейсы экземпляров позволяют презентеру зависеть от абстракций, а не от конкретных классов.

### Полезные нагрузки событий

```ts
interface IProductIdPayload {
  id: string;
}

interface IFormFieldPayload {
  field: string;
  value: string;
}
```

### Состояния компонентов представления

```ts
interface IPageState {
  catalog: HTMLElement[];
  counter: number;
  locked: boolean;
}

interface IModalState {
  content: HTMLElement;
}

interface ICardState {
  title: string;
  price: number | null;
}

interface ICatalogCardState extends ICardState {
  category: string;
  image: string;
}

interface IPreviewCardState extends ICatalogCardState {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

interface IBasketCardState extends ICardState {
  index: number;
}

interface IBasketState {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

interface IFormState {
  valid: boolean;
  errors: string;
}

interface IOrderFormState extends IFormState {
  payment: TPayment | null;
  address: string;
}

interface IContactsFormState extends IFormState {
  email: string;
  phone: string;
}

interface ISuccessState {
  total: number;
}
```

Каждый компонент представления типизирован своим состоянием, компоненты наследуют состояния так же, как классы наследуют друг друга.

## Базовый код

### Класс `Component<T>`

Файл: `src/components/base/Component.ts`.

**Назначение.** Абстрактный базовый класс всех компонентов интерфейса. Дженерик `T` описывает данные, которые можно передать в `render`.

**Конструктор:**
`protected constructor(container: HTMLElement)` — принимает корневой DOM-элемент компонента. Конструктор защищённый, класс используется только через наследование.

**Поля:**
`container: HTMLElement` — корневой DOM-элемент компонента.

**Методы:**
`render(data?: Partial<T>): HTMLElement` — записывает данные в сеттеры компонента в порядке ключей переданного объекта и возвращает корневой DOM-элемент. Вызванный без аргументов, возвращает разметку компонента;
`setImage(element: HTMLImageElement, src: string, alt?: string): void` — защищённый метод, устанавливает изображение и альтернативный текст.

### Класс `Api`

Файл: `src/components/base/Api.ts`. Реализует интерфейс `IApi`.

**Назначение.** Базовая логика отправки HTTP-запросов.

**Конструктор:**
`constructor(baseUrl: string, options: RequestInit = {})` — принимает базовый адрес сервера и необязательный объект с заголовками.

**Поля:**
`baseUrl: string` — базовый адрес сервера;
`options: RequestInit` — защищённое поле с заголовками запросов.

**Методы:**
`get<T>(uri: string): Promise<T>` — выполняет GET-запрос;
`post<T>(uri: string, data: object, method: TApiPostMethod = "POST"): Promise<T>` — отправляет данные в формате JSON;
`handleResponse<T>(response: Response): Promise<T>` — защищённый метод проверки ответа сервера.

### Класс `EventEmitter`

Файл: `src/components/base/Events.ts`. Реализует интерфейс `IEvents`.

**Назначение.** Брокер событий, реализующий паттерн «Наблюдатель». Используется для связи слоя данных и представления. Конструктор параметров не принимает.

**Поля:**
`_events: Map<string | RegExp, Set<Function>>` — коллекция подписок на события.

**Методы:**
`on<T>(event: string | RegExp, callback: (data: T) => void): void` — подписывает обработчик на событие;
`emit<T>(event: string, data?: T): void` — генерирует событие;
`off(event: string | RegExp, callback: Function): void` — снимает обработчик;
`onAll(callback: (event: EmitterEvent) => void): void` — подписывает обработчик на все события;
`offAll(): void` — сбрасывает все обработчики;
`trigger<T>(event: string, context?: Partial<T>): (data: T) => void` — возвращает функцию, генерирующую событие при вызове.

### Утилиты

Файл: `src/utils/utils.ts`.

`ensureElement<T extends HTMLElement>(selector: string, container: ParentNode = document): T` — находит элемент по селектору и выбрасывает исключение, если элемента нет. Избавляет компоненты от приведения типов;
`cloneTemplate<T extends HTMLElement>(descriptor: ITemplateDescriptor): T` — клонирует содержимое HTML-шаблона по его описанию из `TEMPLATES`;
`formatPrice(price: number | null): string` — форматирует цену, при `null` возвращает «Бесценно».

## Слой коммуникации

### Класс `ApiService`

Файл: `src/components/services/ApiService.ts`. Реализует интерфейс `IApiService`.

**Назначение.** Взаимодействие с API сервера «Веб-ларёк». Запросы не интегрированы в модели и компоненты представления, сервис использует `Api` через композицию.

**Конструктор:**
`constructor(api: IApi)` — принимает экземпляр API-клиента.

**Поля:**
`api: IApi` — клиент API для выполнения запросов.

**Методы:**
`getProducts(): Promise<IProductListResponse>` — выполняет GET-запрос на `/product/` и возвращает объект с массивом товаров;
`sendOrder(payload: IOrderPayload): Promise<IOrderResponse>` — отправляет POST-запрос на `/order/` и возвращает подтверждение заказа.

## Слой данных (Model)

Все модели получают брокер событий в конструкторе и генерируют события при изменении данных. Методы-геттеры возвращают копии массивов, поэтому изменить данные в обход модели нельзя.

### Класс `Products`

Файл: `src/components/models/Products.ts`. Реализует интерфейс `IProductsModel`.

**Назначение.** Хранит каталог товаров и товар, выбранный для подробного просмотра.

**Конструктор:**
`constructor(events: IEvents)` — принимает брокер событий.

**Поля:**

| Поле              | Тип                | Описание                        |
| ----------------- | ------------------ | ------------------------------- |
| `events`          | `IEvents`          | Брокер событий.                 |
| `items`           | `IProduct[]`       | Массив товаров каталога.        |
| `selectedProduct` | `IProduct \| null` | Товар, выбранный для просмотра. |

**Методы:**

`setItems(items: IProduct[]): void` — сохраняет каталог товаров. Генерирует событие `catalog:changed`.

`getItems(): IProduct[]` — возвращает копию массива товаров каталога.

`getItemById(id: string): IProduct | undefined` — возвращает товар по идентификатору.

`setSelectedProduct(product: IProduct | null): void` — сохраняет выбранный товар либо сбрасывает выбор значением `null`. Генерирует событие `product:selected`.

`getSelectedProduct(): IProduct | null` — возвращает выбранный товар.

### Класс `Cart`

Файл: `src/components/models/Cart.ts`. Реализует интерфейс `ICartModel`.

**Назначение.** Управляет корзиной товаров: добавление и удаление позиций, проверка наличия, подсчёт суммы и количества.

**Конструктор:**
`constructor(events: IEvents)` — принимает брокер событий.

**Поля:**

| Поле     | Тип          | Описание                       |
| -------- | ------------ | ------------------------------ |
| `events` | `IEvents`    | Брокер событий.                |
| `items`  | `IProduct[]` | Товары, добавленные в корзину. |

**Методы:**

`getItems(): IProduct[]` — возвращает копию массива товаров корзины.

`addItem(product: IProduct): void` — добавляет товар, если его ещё нет в корзине. Генерирует событие `cart:changed`.

`removeItem(id: string): void` — удаляет товар по идентификатору. Генерирует событие `cart:changed`, если товар действительно был удалён.

`clear(): void` — очищает корзину. Генерирует событие `cart:changed`.

`getTotalPrice(): number` — возвращает суммарную стоимость товаров, товары без цены считаются нулевыми.

`getCount(): number` — возвращает количество товаров в корзине.

`hasItem(id: string): boolean` — проверяет, есть ли товар с указанным `id` в корзине.

### Класс `Buyer`

Файл: `src/components/models/Buyer.ts`. Реализует интерфейс `IBuyerModel`.

**Назначение.** Хранение и валидация данных покупателя.

**Конструктор:**
`constructor(events: IEvents)` — принимает брокер событий.

**Поля:**

| Поле      | Тип                | Описание                                 |
| --------- | ------------------ | ---------------------------------------- |
| `events`  | `IEvents`          | Брокер событий.                          |
| `payment` | `TPayment \| null` | Способ оплаты, может быть не установлен. |
| `email`   | `string`           | Email покупателя.                        |
| `phone`   | `string`           | Телефон покупателя.                      |
| `address` | `string`           | Адрес доставки.                          |

**Методы:**

`setData(data: Partial<IBuyer>): void` — обновляет отдельные поля, не сбрасывая остальные. Генерирует событие `buyer:changed`, если хотя бы одно значение изменилось.

`getData(): IBuyer` — возвращает объект со всеми данными покупателя, включая незаполненные поля.

`clear(): void` — очищает данные покупателя. Генерирует событие `buyer:changed`.

`validate(): TBuyerValidationErrors` — проверяет заполненность полей и возвращает объект с сообщениями об ошибках. Пустой объект означает, что ошибок нет.

## Слой представления (View)

Компоненты находятся в `src/components/view/`.

Правила слоя:

- элементы разметки находятся в конструкторе через `ensureElement` и сохраняются в полях класса;
- все элементы являются дочерними корневому элементу компонента;
- слушатели событий устанавливаются один раз в конструкторе;
- компоненты не хранят данные приложения и не содержат логики;
- о действиях пользователя компонент сообщает через обработчик, переданный в конструктор, обработчик генерирует событие через брокер;
- геттеров для получения данных из представления нет;
- экземпляры компонентов создаются один раз при старте приложения и переиспользуются, исключение составляют карточки товаров, которые создаются под каждый элемент массива.

### Класс `Page`

Файл: `src/components/view/Page.ts`. Наследует `Component<IPageState>`.

**Назначение.** Главная страница приложения: каталог, счётчик корзины и блокировка прокрутки.

**Конструктор:**
`constructor(container: HTMLElement, onBasketClick: () => void)` — принимает корневой элемент страницы и обработчик клика по иконке корзины.

**Поля:**
`gallery: HTMLElement` — контейнер каталога `.gallery`;
`wrapper: HTMLElement` — обёртка страницы `.page__wrapper`;
`basketCounter: HTMLElement` — счётчик товаров `.header__basket-counter`;
`basketButton: HTMLButtonElement` — кнопка корзины `.header__basket`.

**Сеттеры:**
`catalog: HTMLElement[]` — заменяет карточки каталога;
`counter: number` — обновляет счётчик корзины;
`locked: boolean` — включает и выключает модификатор `page__wrapper_locked`, запрещающий прокрутку страницы под модальным окном.

**Событие:** `basket:open` — нажата кнопка корзины в шапке.

### Класс `Modal`

Файл: `src/components/view/Modal.ts`. Наследует `Component<IModalState>`.

**Назначение.** Модальное окно `#modal-container`. Класс самостоятельный: от него не наследуются другие компоненты, а любое содержимое передаётся в него готовым компонентом.

**Конструктор:**
`constructor(container: HTMLElement, onClose: () => void)` — принимает корневой элемент окна и обработчик закрытия.

**Поля:**
`contentElement: HTMLElement` — контейнер содержимого `.modal__content`;
`closeButton: HTMLButtonElement` — кнопка закрытия `.modal__close`.

**Сеттер:**
`content: HTMLElement` — помещает компонент в `.modal__content`.

**Методы:**
`open(): void` — добавляет элементу `.modal` модификатор `modal_active`;
`close(): void` — удаляет модификатор `modal_active` и очищает содержимое окна.

**Событие:** `modal:close` — клик по кнопке закрытия или по области вне контейнера окна.

### Класс `Card<T>`

Файл: `src/components/view/Card.ts`. Наследует `Component<T>`, где `T extends ICardState`.

**Назначение.** Абстрактный родитель всех карточек. Содержит общий функционал работы с названием и ценой.

**Конструктор:**
`protected constructor(container: HTMLElement)` — принимает корневой элемент карточки.

**Поля:**
`titleElement: HTMLElement` — название товара `.card__title`;
`priceElement: HTMLElement` — цена товара `.card__price`.

**Сеттеры:**
`title: string` — устанавливает название товара;
`price: number | null` — устанавливает цену, при `null` выводит «Бесценно».

### Класс `ProductCard<T>`

Файл: `src/components/view/Card.ts`. Наследует `Card<T>`, где `T extends ICatalogCardState`.

**Назначение.** Абстрактный родитель карточек с изображением и категорией. Выделен, чтобы не дублировать код в карточке каталога и подробной карточке.

**Конструктор:**
`protected constructor(container: HTMLElement)` — принимает корневой элемент карточки.

**Поля:**
`categoryElement: HTMLElement` — категория товара `.card__category`;
`imageElement: HTMLImageElement` — изображение товара `.card__image`.

**Сеттеры:**
`category: string` — выводит категорию и задаёт модификатор фона из объекта `categoryMap`, для неизвестной категории применяется модификатор по умолчанию;
`image: string` — подставляет изображение с адресом `CDN_URL`.

**Методы:**
`render(data?: Partial<T>): HTMLElement` — вызывает базовый `render` и после этого проставляет альтернативный текст изображения из названия товара. Переопределение снимает зависимость от порядка ключей в переданном объекте.

### Класс `CatalogCard`

Файл: `src/components/view/Card.ts`. Наследует `ProductCard<ICatalogCardState>`, работает с шаблоном `#card-catalog`.

**Назначение.** Карточка товара в каталоге. Отображает категорию, название, изображение и цену.

**Конструктор:**
`constructor(container: HTMLElement, onClick: () => void)` — принимает корневой элемент карточки и обработчик клика.

**Событие:** `product:select` с данными `{ id: string }` — пользователь выбрал карточку для просмотра.

### Класс `PreviewCard`

Файл: `src/components/view/Card.ts`. Наследует `ProductCard<IPreviewCardState>`, работает с шаблоном `#card-preview`.

**Назначение.** Подробная карточка товара. Отображает изображение, категорию, название, описание, цену и кнопку действия.

**Конструктор:**
`constructor(container: HTMLElement, onAction: () => void)` — принимает корневой элемент карточки и обработчик нажатия кнопки.

**Поля:**
`descriptionElement: HTMLElement` — описание товара `.card__text`;
`buttonElement: HTMLButtonElement` — кнопка действия `.card__button`.

**Сеттеры:**
`description: string` — выводит описание;
`buttonText: string` — подпись кнопки;
`buttonDisabled: boolean` — доступность кнопки.

Подпись и доступность кнопки подготавливает презентер:

- «Купить» — товара нет в корзине;
- «Удалить из корзины» — товар уже добавлен;
- «Недоступно» и заблокированное состояние — у товара нет цены.

**Событие:** `product:action` — нажата кнопка покупки или удаления товара.

### Класс `BasketCard`

Файл: `src/components/view/Card.ts`. Наследует `Card<IBasketCardState>`, работает с шаблоном `#card-basket`.

**Назначение.** Карточка товара в корзине. Отображает порядковый номер, название, цену и кнопку удаления.

**Конструктор:**
`constructor(container: HTMLElement, onDelete: () => void)` — принимает корневой элемент карточки и обработчик удаления.

**Поля:**
`indexElement: HTMLElement` — порядковый номер `.basket__item-index`;
`deleteButton: HTMLButtonElement` — кнопка удаления `.basket__item-delete`.

**Сеттер:**
`index: number` — выводит порядковый номер товара.

**Событие:** `cart:remove` с данными `{ id: string }` — нажата кнопка удаления товара из корзины.

### Класс `Basket`

Файл: `src/components/view/Basket.ts`. Наследует `Component<IBasketState>`, работает с шаблоном `#basket`.

**Назначение.** Корзина товаров. Отображает список товаров, суммарную стоимость и кнопку оформления. Если товаров нет, вместо списка выводится надпись «Корзина пуста».

**Конструктор:**
`constructor(container: HTMLElement, onOrder: () => void)` — принимает корневой элемент корзины и обработчик нажатия кнопки оформления.

**Поля:**
`listElement: HTMLElement` — список товаров `.basket__list`;
`totalElement: HTMLElement` — итоговая стоимость `.basket__price`;
`orderButton: HTMLButtonElement` — кнопка оформления `.basket__button`.

**Сеттеры:**
`items: HTMLElement[]` — список карточек корзины либо надпись о пустой корзине;
`total: number` — итоговая стоимость;
`buttonDisabled: boolean` — доступность кнопки оформления.

**Событие:** `order:open` — нажата кнопка «Оформить».

### Класс `Form<T>`

Файл: `src/components/view/Form.ts`. Наследует `Component<T>`, где `T extends IFormState`.

**Назначение.** Абстрактный родитель форм оформления заказа. Содержит общий функционал: обработку отправки формы, обработку ввода в полях, управление доступностью кнопки и вывод ошибок.

**Конструктор:**
`protected constructor(container: HTMLFormElement, onSubmit: () => void, onChange: (field: string, value: string) => void)` — принимает элемент формы, обработчик отправки и обработчик изменения поля.

**Поля:**
`submitButton: HTMLButtonElement` — кнопка отправки формы;
`errorsElement: HTMLElement` — контейнер ошибок `.form__errors`.

**Сеттеры:**
`valid: boolean` — активирует или блокирует кнопку отправки;
`errors: string` — выводит текст ошибок.

### Класс `OrderForm`

Файл: `src/components/view/OrderForm.ts`. Наследует `Form<IOrderFormState>`, работает с шаблоном `#order`.

**Назначение.** Первый шаг оформления: выбор способа оплаты и ввод адреса доставки. Выбранная кнопка оплаты выделяется модификатором `button_alt-active`.

**Конструктор:**
`constructor(container: HTMLFormElement, onSubmit: () => void, onChange: (field: string, value: string) => void)` — принимает элемент формы и два обработчика.

**Поля:**
`addressInput: HTMLInputElement` — поле адреса доставки;
`paymentButtons: HTMLButtonElement[]` — кнопки выбора способа оплаты.

**Сеттеры:**
`payment: TPayment | null` — выделяет выбранный способ оплаты;
`address: string` — подставляет адрес доставки.

**События:**
`order:change` с данными `{ field, value }` — изменён адрес или выбран способ оплаты;
`order:next` — отправлена форма первого шага.

### Класс `ContactsForm`

Файл: `src/components/view/ContactsForm.ts`. Наследует `Form<IContactsFormState>`, работает с шаблоном `#contacts`.

**Назначение.** Второй шаг оформления: ввод почты и телефона.

**Конструктор:**
`constructor(container: HTMLFormElement, onSubmit: () => void, onChange: (field: string, value: string) => void)` — принимает элемент формы и два обработчика.

**Поля:**
`emailInput: HTMLInputElement` — поле почты;
`phoneInput: HTMLInputElement` — поле телефона.

**Сеттеры:**
`email: string` — подставляет почту;
`phone: string` — подставляет телефон.

**События:**
`contacts:change` с данными `{ field, value }` — изменена почта или телефон;
`order:pay` — отправлена форма оплаты.

### Класс `Success`

Файл: `src/components/view/Success.ts`. Наследует `Component<ISuccessState>`, работает с шаблоном `#success`.

**Назначение.** Сообщение об успешном оформлении заказа и сумме списания.

**Конструктор:**
`constructor(container: HTMLElement, onClose: () => void)` — принимает корневой элемент и обработчик закрытия.

**Поля:**
`totalElement: HTMLElement` — сумма списания `.order-success__description`;
`closeButton: HTMLButtonElement` — кнопка закрытия `.order-success__close`.

**Сеттер:**
`total: number` — выводит сумму списанных синапсов.

**Событие:** `modal:close` — нажата кнопка «За новыми покупками!».

## События приложения

Имена событий вынесены в объект `EVENTS` файла `src/utils/constants.ts`.

### События моделей

| Событие            | Источник   | Описание                                  |
| ------------------ | ---------- | ----------------------------------------- |
| `catalog:changed`  | `Products` | В модель сохранён каталог товаров.        |
| `product:selected` | `Products` | Изменён или сброшен товар для просмотра.  |
| `cart:changed`     | `Cart`     | Изменилось содержимое корзины.            |
| `buyer:changed`    | `Buyer`    | Изменились или очищены данные покупателя. |

### События представлений

| Событие           | Источник           | Данные             | Описание                                   |
| ----------------- | ------------------ | ------------------ | ------------------------------------------ |
| `product:select`  | `CatalogCard`      | `{ id: string }`   | Выбрана карточка товара в каталоге.        |
| `product:action`  | `PreviewCard`      | —                  | Нажата кнопка покупки или удаления товара. |
| `basket:open`     | `Page`             | —                  | Нажата иконка корзины.                     |
| `cart:remove`     | `BasketCard`       | `{ id: string }`   | Нажата кнопка удаления товара из корзины.  |
| `order:open`      | `Basket`           | —                  | Нажата кнопка оформления заказа.           |
| `order:change`    | `OrderForm`        | `{ field, value }` | Изменён адрес или выбран способ оплаты.    |
| `order:next`      | `OrderForm`        | —                  | Нажата кнопка перехода ко второй форме.    |
| `contacts:change` | `ContactsForm`     | `{ field, value }` | Изменена почта или телефон.                |
| `order:pay`       | `ContactsForm`     | —                  | Нажата кнопка оплаты заказа.               |
| `modal:close`     | `Modal`, `Success` | —                  | Закрыто модальное окно.                    |

## Презентер

Презентер реализован в файле `src/main.ts` без выделения в отдельный класс: у приложения одна страница, поэтому достаточно одного презентера, отвечающего за её логику.

Презентер состоит из обработчиков событий и выполняет следующие задачи:

1. создаёт экземпляры `Api`, `ApiService`, `EventEmitter`, моделей и всех компонентов представления;
2. запрашивает каталог товаров и сохраняет его в модель `Products`;
3. по событию `catalog:changed` создаёт карточки каталога и передаёт их в `Page`;
4. по событию `product:selected` готовит состояние подробной карточки, включая подпись и доступность кнопки, и открывает её в модальном окне;
5. добавляет и удаляет товары в корзине, закрывая модальное окно после действия;
6. по событию `cart:changed` обновляет счётчик корзины и, если корзина открыта, обновляет её содержимое;
7. открывает корзину и формы оформления заказа, блокируя прокрутку страницы;
8. сохраняет введённые данные в модель `Buyer`, а по событию `buyer:changed` обновляет только доступность кнопки и текст ошибок, не переписывая значения полей ввода, благодаря чему фокус в поле сохраняется;
9. формирует `IOrderPayload` из данных `Buyer` и `Cart` и отправляет заказ через `ApiService`;
10. после успешной оплаты показывает компонент `Success`, затем очищает корзину и данные покупателя;
11. при ошибке отправки заказа выводит сообщение в блоке ошибок формы контактов.

Презентер не хранит данные приложения и не генерирует события, он только обрабатывает их. Единственное состояние, которое он держит, — это переменная `currentModal` с видом открытого модального окна, состояние интерфейса, а не данные предметной области.

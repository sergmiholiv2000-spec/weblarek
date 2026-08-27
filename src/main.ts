import "./scss/styles.scss";

import { Products } from "./models/Products";
import { Cart } from "./models/Cart";
import { Buyer } from "./models/Buyer";
import { ApiService } from "./models/ApiService";
import { apiProducts } from "./utils/data";
import { IProductsResponse, IApi } from "./types";

// --- ЗАГЛУШКА API (чтобы проект собирался и не падал без сервера) ---
const mockApiClient: IApi = {
  get: async <T>(uri: string): Promise<T> => {
    console.log(`[MOCK] GET ${uri}`);
    if (uri === "/product/") {
      return { items: apiProducts.items } as unknown as T;
    }
    return {} as T;
  },
  post: async <T>(uri: string, data: object): Promise<T> => {
    console.log(`[MOCK] POST ${uri}`, data);
    return {
      total: 0,
      orderId: "MOCK-123",
      message: "Mock order accepted",
    } as T;
  },
};
// --------------------------------------------------------------------

console.group("🚀 ЗАПУСК main.ts: проверка моделей данных (MVP)");

const productsModel = new Products();
const cart = new Cart();
const buyer = new Buyer();

// === 1. Проверка Products: setItems и getItems ===
console.group("📦 Проверка модели Products");
productsModel.setItems(apiProducts.items);
const items = productsModel.getItems();
console.log("✅ setItems(apiProducts.items) выполнен");
console.log("📋 Массив товаров из каталога:", items);
console.log("🔢 Количество товаров в модели:", items.length);

const firstProduct = items[0];
if (firstProduct) {
  console.log("✔️ Первый товар (пример):", {
    id: firstProduct.id,
    title: firstProduct.title,
    price: firstProduct.price,
  });
} else {
  console.warn("⚠️ В массиве товаров нет ни одного элемента!");
}
console.groupEnd();

// === 2. Проверка Cart: addItem, getItems, getCount, getTotalPrice ===
console.group("🛒 Проверка модели Cart");
if (firstProduct) {
  cart.addItem(firstProduct);
  console.log("✅ addItem(первый товар) выполнен");
  console.log("📋 Товары в корзине:", cart.getItems());
  console.log("🔢 Количество товаров в корзине:", cart.getCount());
  console.log("💰 Общая стоимость корзины:", cart.getTotalPrice());

  // Добавим ещё один товар для проверки суммы
  const secondProduct = items[1];
  if (secondProduct) {
    cart.addItem(secondProduct);
    console.log("✅ addItem(второй товар) выполнен");
    console.log("📋 Корзина после добавления второго товара:", cart.getItems());
    console.log("🔢 Количество в корзине:", cart.getCount());
    console.log(
      "💰 Общая стоимость после второго товара:",
      cart.getTotalPrice(),
    );
  }
} else {
  console.warn(
    "⚠️ Не удалось добавить товар в корзину: нет товаров в каталоге",
  );
}

// Очистим корзину для чистоты эксперимента
cart.clear();
console.log("🧹 Корзина очищена (cart.clear())");
console.groupEnd();

// === 3. Проверка Buyer: setData, getData, validate ===
console.group("👤 Проверка модели Buyer");
buyer.setData({ payment: "card", address: "ул. Примерная, д. 1" });
console.log("✅ setData (частичные данные) выполнен");
console.log("📋 Частичные данные покупателя:", buyer.getData());
console.log("⚠️ Ошибки валидации (частичные данные):", buyer.validate());

buyer.setData({ email: "test@example.com", phone: "+79990000000" });
console.log("✅ setData (дозаполненные данные) выполнен");
console.log("📋 Полные данные покупателя:", buyer.getData());
console.log("✅ Ошибки валидации (полные данные):", buyer.validate());
console.groupEnd();

// === 4. Демонстрация ApiService (архитектура) ===
console.group("🌐 Слой коммуникации: ApiService");
const apiService = new ApiService(mockApiClient);

(async () => {
  try {
    console.log("🔄 Запрос через ApiService.getProducts()...");
    const response: IProductsResponse = await apiService.getProducts();
    console.log("✅ Ответ от ApiService:", response);

    // Перезаписываем товары данными «с сервера»
    productsModel.setItems(response.items);
    console.log(
      "✅ Товары обновлены через ApiService (setItems из ответа сервера)",
    );
    console.log("📋 Текущий массив товаров:", productsModel.getItems().length);
  } catch (error) {
    console.error("❌ Ошибка в ApiService:", error);
  }
})();
console.groupEnd();

console.groupEnd();

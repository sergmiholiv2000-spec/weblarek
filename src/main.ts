import "./scss/styles.scss";

import { Products } from "./models/components/Products";
import { Cart } from "./models/components/Cart";
import { Buyer } from "./models/components/Buyer";

import { Api } from "./components/base/Api";
import { ApiService } from "./components/base/services/ApiService";
import { API_URL } from "./utils/constants";
import { IProductListResponse } from "./types";

const api = new Api(API_URL);
const apiService = new ApiService(api);

const productsModel = new Products();
const cart = new Cart();
const buyer = new Buyer();

console.group("🚀 ЗАПУСК main.ts: проверка моделей данных (MVP)");

// === 1. Проверка Products: setItems, getItems, setSelectedProduct, getSelectedProduct, getItemById ===
console.group("📦 Проверка модели Products");

// Сначала загружаем данные с сервера
(async () => {
  try {
    console.log("Запрос через ApiService.getProducts()...");
    const response: IProductListResponse = await apiService.getProducts();
    console.log("Ответ от ApiService:", response);

    productsModel.setItems(response.items);
    console.log("Каталог, сохранённый в модель:", productsModel.getItems());
    console.log(
      "Количество товаров в модели:",
      productsModel.getItems().length,
    );

    const items = productsModel.getItems();
    const firstProduct = items[0];

    if (firstProduct) {
      console.log("Первый товар (пример):", {
        id: firstProduct.id,
        title: firstProduct.title,
        price: firstProduct.price,
      });

      // Проверка методов работы с выбранным товаром
      productsModel.setSelectedProduct(firstProduct);
      console.log("Выбранный товар:", productsModel.getSelectedProduct());
      console.log(
        "Товар по идентификатору:",
        productsModel.getItemById(firstProduct.id),
      );
    } else {
      console.warn("⚠️ В массиве товаров нет ни одного элемента!");
    }
  } catch (error) {
    console.error("❌ Ошибка при загрузке товаров:", error);
  }
})();

console.groupEnd();

// === 2. Проверка Cart: addItem, removeItem, hasItem, getItems, getCount, getTotalPrice, clear ===
console.group("🛒 Проверка модели Cart");

const itemsForCart = productsModel.getItems();
const firstProduct = itemsForCart[0];
const secondProduct = itemsForCart[1];

if (firstProduct) {
  cart.addItem(firstProduct);
  console.log("addItem(первый товар) выполнен");
  console.log("Товары в корзине:", cart.getItems());
  console.log("Количество товаров в корзине:", cart.getCount());
  console.log("Общая стоимость корзины:", cart.getTotalPrice());

  console.log("Товар есть в корзине:", cart.hasItem(firstProduct.id));

  if (secondProduct) {
    cart.addItem(secondProduct);
    console.log("addItem(второй товар) выполнен");
    console.log("Корзина после добавления второго товара:", cart.getItems());
    console.log("Количество в корзине:", cart.getCount());
    console.log("Общая стоимость после второго товара:", cart.getTotalPrice());
  }

  // Проверка removeItem
  cart.removeItem(firstProduct.id);
  console.log("Корзина после удаления товара:", cart.getItems());
} else {
  console.warn(
    "⚠️ Не удалось добавить товар в корзину: нет товаров в каталоге",
  );
}

// Проверка clear
cart.clear();
console.log("🧹 Корзина очищена (cart.clear())");
console.groupEnd();

// === 3. Проверка Buyer: setData, getData, validate, clear ===
console.group("👤 Проверка модели Buyer");

buyer.setData({ payment: "card", address: "ул. Примерная, д. 1" });
console.log("setData (частичные данные) выполнен");
console.log("Частичные данные покупателя:", buyer.getData());
console.log("Ошибки валидации (частичные данные):", buyer.validate());

buyer.setData({ email: "test@example.com", phone: "+79990000000" });
console.log("setData (дозаполненные данные) выполнен");
console.log("Полные данные покупателя:", buyer.getData());
console.log("Ошибки валидации (полные данные):", buyer.validate());

// Проверка clear
buyer.clear();
console.log("Данные покупателя после очистки:", buyer.getData());
console.groupEnd();

// === 4. Демонстрация ApiService (финальная проверка после загрузки данных) ===
console.group("🌐 Слой коммуникации: ApiService");

// Если нужно дополнительно убедиться, что ApiService корректно работает,
// можно сделать повторный запрос (опционально, зависит от требований).
// В текущей реализации данные уже загружены в productsModel выше.
console.log("ApiService настроен и готов к работе через экземпляр Api.");
console.groupEnd();

console.groupEnd();

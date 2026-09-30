import type { Order } from "../types/orders";

const ORDERS_STORAGE_KEY = "orders";

export function getStoredOrders(): Order[] {
  try {
    const storedOrders =
      localStorage.getItem(
        ORDERS_STORAGE_KEY,
      );

    if (!storedOrders) {
      return [];
    }

    return JSON.parse(
      storedOrders,
    ) as Order[];
  } catch (error) {
    console.error(
      "Failed to read stored orders:",
      error,
    );

    return [];
  }
}

export function saveOrder(
  order: Order,
): void {
  try {
    const existingOrders =
      getStoredOrders();

    const updatedOrders = [
      ...existingOrders,
      order,
    ];

    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(
        updatedOrders,
      ),
    );
  } catch (error) {
    console.error(
      "Failed to save order:",
      error,
    );
  }
}
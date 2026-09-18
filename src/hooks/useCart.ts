import { useEffect, useMemo, useState } from "react";

import type { Product } from "../data/products";
import type { CartItem } from "../types/cart";

import { fetchCart, getStoredCart, saveCart } from "../services/cartServices";

interface UseCartResult {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

export function useCart(): UseCartResult {
  const [items, setItems] = useState<CartItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const addItem = (product: Product, quantity: number) => {
    setItems((previousItems) => {
      const existingItem = previousItems.find((item) => item.id === product.id);

      if (existingItem) {
        return previousItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...previousItems,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        },
      ];
    });
  };

  const removeItem = (id: number) => {
    setItems((previousItems) => previousItems.filter((item) => item.id !== id));
  };

  const updateQty = (id: number, quantity: number) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = getStoredCart();

      if (storedCart.length > 0) {
        setItems(storedCart);
        setIsLoading(false);

        return;
      }

      try {
        const apiCart = await fetchCart();

        setItems(apiCart);
        saveCart(apiCart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    saveCart(items);
  }, [items, isLoading]);

  return {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    subtotal,
  };
}

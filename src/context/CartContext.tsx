import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import type { Product } from "../data/products";
import {
  fetchCart,
  getStoredCart,
  saveCart,
} from "../services/cartServices";

import {
  cartReducer,
  type CartState,
} from "./cartReducer";

interface CartContextValue {
  items: CartState["items"];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext =
  createContext<CartContextValue | null>(null);

const initialState: CartState = {
  items: [],
  isLoading: true,
};

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
  );

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = getStoredCart();

      if (storedCart.length > 0) {
        dispatch({
          type: "SET_ITEMS",
          payload: storedCart,
        });

        dispatch({
          type: "SET_LOADING",
          payload: false,
        });

        return;
      }

      try {
        const apiCart = await fetchCart();

        dispatch({
          type: "SET_ITEMS",
          payload: apiCart,
        });

        saveCart(apiCart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (state.isLoading) {
      return;
    }

    saveCart(state.items);
  }, [state.items, state.isLoading]);

  const addItem = (
    product: Product,
    quantity: number,
  ) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        product,
        quantity,
      },
    });
  };

  const removeItem = (id: number) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    });
  };

  const updateQty = (
    id: number,
    quantity: number,
  ) => {
    dispatch({
      type: "UPDATE_QTY",
      payload: {
        id,
        quantity,
      },
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });
  };

  const totalItems = useMemo(
    () =>
      state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [state.items],
  );

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0,
      ),
    [state.items],
  );

  const value: CartContextValue = {
    items: state.items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    subtotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCartContext must be used inside CartProvider",
    );
  }

  return context;
}
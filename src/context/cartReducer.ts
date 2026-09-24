import type { Product } from "../data/products";
import type { CartItem } from "../types/cart";

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

export type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        product: Product;
        quantity: number;
      };
    }
  | {
      type: "REMOVE_ITEM";
      payload: number;
    }
  | {
      type: "UPDATE_QTY";
      payload: {
        id: number;
        quantity: number;
      };
    }
  | {
      type: "CLEAR_CART";
    }
  | {
      type: "SET_ITEMS";
      payload: CartItem[];
    }
  | {
      type: "SET_LOADING";
      payload: boolean;
    };

export function cartReducer(
  state: CartState,
  action: CartAction,
): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;

      const existingItem = state.items.find(
        (item) => item.id === product.id,
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
          },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.id !== action.payload,
        ),
      };

    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: action.payload.quantity,
              }
            : item,
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "SET_ITEMS":
      return {
        ...state,
        items: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}
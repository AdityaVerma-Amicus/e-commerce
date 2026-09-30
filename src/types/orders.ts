import type { CartItem } from "./cart";

export type ShippingMethod =
  | "standard"
  | "express"
  | "overnight";

export interface Order {
  items: CartItem[];
  shipping: ShippingMethod;
  total: number;
  date: string;
  status: "Processing";
}
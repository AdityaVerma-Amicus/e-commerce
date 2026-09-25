import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CartItem from "./CartItem/CartItem";
import "./Cart.css";

import type { CartItem as CartItemType } from "../../types/cart";

type ShippingMethod = "standard" | "express" | "overnight";

const SHIPPING_RATES: Record<ShippingMethod, number> = {
  standard: 5,
  express: 15,
  overnight: 25,
};

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartProps) {
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const shipping = SHIPPING_RATES[shippingMethod];

  const tax = subtotal * 0.08;

  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <section className="cart">
        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>

        <div className="cart-empty">
          <h2>Your cart is empty</h2>

          <p>
            Add products to your cart to see them here.
          </p>

          <button
            type="button"
            className="cart-continue-button"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="cart">
      <div className="cart-header">
        <h1>Your Cart</h1>

        <span>
          {totalQuantity}{" "}
          {totalQuantity === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="cart-content">
        {/* Left side */}
        <div className="cart-items-section">
          <div className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))}
          </div>

          {/* Shipping selection below cart items */}
          <div className="cart-shipping">
            <label
              htmlFor="shipping-method"
              className="cart-shipping-label"
            >
              Shipping Type <span>*</span>
            </label>

            <select
              id="shipping-method"
              value={shippingMethod}
              onChange={(event) =>
                setShippingMethod(
                  event.target.value as ShippingMethod,
                )
              }
              className="cart-shipping-select"
            >
              <option value="standard">
                Standard ($5)
              </option>

              <option value="express">
                Express ($15)
              </option>

              <option value="overnight">
                Overnight ($25)
              </option>
            </select>
          </div>
        </div>

        {/* Right side */}
        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>

            <strong>
              ${subtotal.toFixed(2)}
            </strong>
          </div>

          <div className="cart-summary-row">
            <span>Shipping</span>

            <strong>
              ${shipping.toFixed(2)}
            </strong>
          </div>

          <div className="cart-summary-row">
            <span>Tax (8%)</span>

            <strong>
              ${tax.toFixed(2)}
            </strong>
          </div>

          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>

            <strong>
              ${total.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            className="cart-checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          <button
            type="button"
            className="cart-continue-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
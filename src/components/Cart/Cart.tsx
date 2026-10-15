import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CartItem from "./CartItem/CartItem";
import CartSkeleton from "./CartSkeleton";
import "./Cart.css";

import type { CartItem as CartItemType } from "../../types/cart";
import { useCartContext } from "../../context/CartContext";
import type { ShippingMethod } from "../../types/orders";

const SHIPPING_RATES: Record<ShippingMethod, number> = {
  standard: 5,
  express: 15,
  overnight: 25,
};

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  isLoading?: boolean;
}

function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  isLoading = false, 
}: CartProps) {
  const navigate = useNavigate();
  const [cartAnnouncement, setCartAnnouncement] = useState("");

  const { shippingMethod, setShippingMethod } = useCartContext();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const shipping = SHIPPING_RATES[shippingMethod];
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleRemoveItem = (item: CartItemType) => {
    onRemoveItem(item.id);
    setCartAnnouncement(`${item.name} removed from cart.`);
  };

  
  if (isLoading) {
    return <CartSkeleton />;
  }


  if (items.length === 0) {
    return (
      <section className="cart" aria-labelledby="cart-title">
        <div className="cart-header">
          <h1 id="cart-title">Your Cart</h1>
        </div>

        <p className="sr-only" role="status" aria-atomic="true">
          {cartAnnouncement}
        </p>

        <div className="cart-empty" aria-labelledby="empty-cart-title">
          <h2 id="empty-cart-title">Your cart is empty</h2>
          <p>Add products to your cart to see them here.</p>

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
    <section className="cart" aria-labelledby="cart-title">
      <div className="cart-header">
        <h1 id="cart-title">Your Cart</h1>

        <span aria-live="polite" aria-atomic="true">
          {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
        </span>
      </div>

      <p className="sr-only" role="status" aria-atomic="true">
        {cartAnnouncement}
      </p>

      <div className="cart-content">
        <div className="cart-items-section">
          <div
            className="cart-items"
            role="list"
            aria-label="Items in your cart"
          >
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={() => handleRemoveItem(item)}
              />
            ))}
          </div>

          <div className="cart-shipping">
            <label htmlFor="shipping-method" className="cart-shipping-label">
              Shipping Type <span aria-hidden="true">*</span>
            </label>

            <select
              id="shipping-method"
              name="shippingMethod"
              value={shippingMethod}
              onChange={(event) =>
                setShippingMethod(event.target.value as ShippingMethod)
              }
              className="cart-shipping-select"
            >
              <option value="standard">Standard ($5)</option>
              <option value="express">Express ($15)</option>
              <option value="overnight">Overnight ($25)</option>
            </select>
          </div>
        </div>

        <aside className="cart-summary" aria-labelledby="order-summary-title">
          <h2 id="order-summary-title">Order Summary</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>

          <div className="cart-summary-row">
            <span>Shipping</span>
            <strong>${shipping.toFixed(2)}</strong>
          </div>

          <div className="cart-summary-row">
            <span>Tax (8%)</span>
            <strong>${tax.toFixed(2)}</strong>
          </div>

          <div
            className="cart-summary-row cart-summary-total"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
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
import { useNavigate } from "react-router-dom";

import CartItem from "./CartItem/CartItem";
import "./Cart.css";

import type { CartItem as CartItemType } from "../../types/cart";

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

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

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

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>

            <strong>
              ${subtotal.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            className="cart-checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
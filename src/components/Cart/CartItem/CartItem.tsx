
import type { CartItem as CartItemType } from "../../../types/cart";
import "./CartItem.css";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const lineTotal = item.price * item.quantity;

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      return;
    }

    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <article
      className="cart-item"
      role="listitem"
      aria-label={item.name}
    >
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <h3>{item.name}</h3>

        <p className="cart-item-price">
          <span className="sr-only">Unit price: </span>
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div
        className="cart-item-quantity"
        role="group"
        aria-label={`Quantity for ${item.name}`}
      >
        <button
          type="button"
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          aria-label={`Decrease quantity of ${item.name}`}
          className="cart-item-quantity-button"
        >
          −
        </button>

        <span aria-live="polite" aria-atomic="true">
          <span className="sr-only">Quantity: </span>
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          aria-label={`Increase quantity of ${item.name}`}
          className="cart-item-quantity-button"
        >
          +
        </button>
      </div>

      <div
        className="cart-item-total"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">Line total: </span>
        ${lineTotal.toFixed(2)}
      </div>

      <button
        type="button"
        className="cart-item-remove"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name} from cart`}
      >
        Remove
      </button>
    </article>
  );
}

export default CartItem;

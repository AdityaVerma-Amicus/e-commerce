import type { CartItem as CartItemType } from "../../../types/cart";
import "./CartItem.css";
interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (
        id: number,
        quantity: number
    ) => void;
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

        onUpdateQuantity(
            item.id,
            item.quantity - 1
        );
    };

    const handleIncrease = () => {
        onUpdateQuantity(
            item.id,
            item.quantity + 1
        );
    };

    return (
        <article className="cart-item">
            <div className="cart-item-image">
                <img
                    src={item.image}
                    alt={item.name}
                />
            </div>

            <div className="cart-item-details">
                <h3>{item.name}</h3>

                <p className="cart-item-price">
                    ${item.price.toFixed(2)}
                </p>
            </div>

            <div className="cart-item-quantity">
                <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                >
                    −
                </button>

                <span>{item.quantity}</span>

                <button
                    type="button"
                    onClick={handleIncrease}
                    aria-label={`Increase quantity of ${item.name}`}
                >
                    +
                </button>
            </div>

            <div className="cart-item-total">
                ${lineTotal.toFixed(2)}
            </div>

            <button
                type="button"
                className="cart-item-remove"
                onClick={() => onRemove(item.id)}
            >
                Remove
            </button>
        </article>
    );
}

export default CartItem;
import "./CheckoutButton.css";

interface CheckoutButtonProps {
    onClick: () => void;
}

function CheckoutButton({ onClick }: CheckoutButtonProps) {
    return (
        <button
            className="checkout-btn"
            type="button"
            onClick={onClick}
        >
            Checkout
        </button>
    );
}

export default CheckoutButton;
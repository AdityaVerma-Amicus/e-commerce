import "./CartSkeleton.css";

function CartSkeleton() {
  return (
    <section
      className="cart cart-skeleton"
      aria-label="Loading shopping cart"
      aria-busy="true"
    >
      <div className="cart-header">
        <div className="cart-skeleton-bar cart-skeleton-heading" />
        <div className="cart-skeleton-bar cart-skeleton-count" />
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items">
            {Array.from({ length: 2 }, (_, index) => (
              <div className="cart-skeleton-item" key={index}>
                <div className="cart-skeleton-block cart-skeleton-image" />

                <div className="cart-skeleton-details">
                  <div className="cart-skeleton-bar cart-skeleton-name" />
                  <div className="cart-skeleton-bar cart-skeleton-price" />
                </div>

                <div className="cart-skeleton-bar cart-skeleton-quantity" />
                <div className="cart-skeleton-bar cart-skeleton-total" />
                <div className="cart-skeleton-bar cart-skeleton-remove" />
              </div>
            ))}
          </div>

          <div className="cart-skeleton-shipping">
            <div className="cart-skeleton-bar cart-skeleton-label" />
            <div className="cart-skeleton-block cart-skeleton-select" />
          </div>
        </div>

        <aside className="cart-summary">
          <div className="cart-skeleton-bar cart-skeleton-summary-heading" />

          {Array.from({ length: 3 }, (_, index) => (
            <div className="cart-skeleton-summary-row" key={index}>
              <div className="cart-skeleton-bar cart-skeleton-summary-label" />
              <div className="cart-skeleton-bar cart-skeleton-summary-value" />
            </div>
          ))}

          <div className="cart-skeleton-summary-row cart-skeleton-summary-total">
            <div className="cart-skeleton-bar cart-skeleton-summary-label" />
            <div className="cart-skeleton-bar cart-skeleton-total-value" />
          </div>

          <div className="cart-skeleton-block cart-skeleton-button" />
          <div className="cart-skeleton-block cart-skeleton-secondary-button" />
        </aside>
      </div>
    </section>
  );
}

export default CartSkeleton;
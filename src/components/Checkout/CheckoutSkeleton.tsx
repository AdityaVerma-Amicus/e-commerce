import "./CheckoutSkeleton.css";

function CheckoutSkeleton() {
  return (
    <div
      className="checkout-skeleton"
      role="status"
      aria-label="Loading checkout"
      aria-busy="true"
    >
      {/* CHECKOUT HEADER */}
      <div className="checkout-skeleton-title">
        <div className="checkout-skeleton-bar checkout-skeleton-title-text" />
      </div>

      {/* CHECKOUT STEPS */}
      <div className="checkout-skeleton-steps">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="checkout-skeleton-step" key={index}>
            <div className="checkout-skeleton-step-circle" />
            <div className="checkout-skeleton-bar checkout-skeleton-step-label" />
          </div>
        ))}
      </div>

      {/* CHECKOUT CARD */}
      <div className="checkout-skeleton-card">
        <div className="checkout-skeleton-layout">
          {/* FORM AREA */}
          <section className="checkout-skeleton-form">
            <div className="checkout-skeleton-bar checkout-skeleton-section-title" />

            {Array.from({ length: 4 }, (_, index) => (
              <div className="checkout-skeleton-field" key={index}>
                <div className="checkout-skeleton-bar checkout-skeleton-label" />
                <div className="checkout-skeleton-block checkout-skeleton-input" />
              </div>
            ))}

            <div className="checkout-skeleton-block checkout-skeleton-primary-button" />
          </section>

          {/* ORDER SUMMARY */}
          <aside className="checkout-skeleton-summary">
            <div className="checkout-skeleton-bar checkout-skeleton-summary-title" />

            {Array.from({ length: 3 }, (_, index) => (
              <div className="checkout-skeleton-summary-row" key={index}>
                <div className="checkout-skeleton-bar checkout-skeleton-summary-label" />
                <div className="checkout-skeleton-bar checkout-skeleton-summary-value" />
              </div>
            ))}

            <div className="checkout-skeleton-summary-row checkout-skeleton-summary-total">
              <div className="checkout-skeleton-bar checkout-skeleton-summary-label" />
              <div className="checkout-skeleton-bar checkout-skeleton-total-value" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSkeleton;
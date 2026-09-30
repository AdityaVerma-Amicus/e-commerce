import type { CartItem } from "../../types/cart";

import type { ShippingFormData } from "../ShippingForm/ShippingForm";

import type { PaymentFormData } from "./PaymentForm";

import "./ReviewSection.css";

interface ReviewSectionProps {
  shippingData: ShippingFormData | null;

  paymentData: PaymentFormData | null;

  items: CartItem[];

  onBack: () => void;

  onPlaceOrder: () => void;
}

function ReviewSection({
  shippingData,
  paymentData,
  items,
  onBack,
  onPlaceOrder,
}: ReviewSectionProps) {
  return (
    <section className="review-section">
      <h2>Review Your Order</h2>

      {/* =========================
          SHIPPING DETAILS
         ========================= */}

      <div className="review-block">
        <h3>Shipping Details</h3>

        {shippingData && (
          <div className="review-details">
            <div>
              <span>Full Name</span>
              <strong>{shippingData.fullName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{shippingData.email}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{shippingData.phone}</strong>
            </div>

            <div>
              <span>Street Address</span>
              <strong>{shippingData.streetAddress}</strong>
            </div>

            {shippingData.aptSuite && (
              <div>
                <span>Apartment / Suite</span>

                <strong>{shippingData.aptSuite}</strong>
              </div>
            )}

            <div>
              <span>City</span>
              <strong>{shippingData.city}</strong>
            </div>

            <div>
              <span>State</span>
              <strong>{shippingData.stateName}</strong>
            </div>

            <div>
              <span>ZIP / Postal Code</span>
              <strong>{shippingData.zip}</strong>
            </div>

            <div>
              <span>Country</span>
              <strong>{shippingData.countryName}</strong>
            </div>

            <div>
              <span>Shipping Method</span>
              <strong>{shippingData.shippingMethod}</strong>
            </div>
          </div>
        )}
      </div>

      {/* =========================
          PAYMENT
         ========================= */}

      <div className="review-block">
        <h3>Payment</h3>

        <div className="review-payment">
          <span>Payment Method</span>

          <strong>Credit Card</strong>

          {paymentData && (
            <span>
              Card ending in <strong>{paymentData.cardNumber.slice(-4)}</strong>
            </span>
          )}
        </div>
      </div>

      {/* =========================
          ORDER REVIEW
         ========================= */}

      <div className="review-block">
        <h3>Order Review</h3>

        <div className="review-items">
          {items.map((item) => {
            const lineTotal = item.price * item.quantity;

            return (
              <div key={item.id} className="review-item">
                <div className="review-item-info">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="review-item-image"
                  />

                  <div>
                    <p className="review-item-name">{item.name}</p>

                    <span>Qty: {item.quantity}</span>

                    <span>Unit Price: ${item.price.toFixed(2)}</span>
                  </div>
                </div>

                <strong>${lineTotal.toFixed(2)}</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
          ACTIONS
         ========================= */}

      <div className="review-actions">
        <button type="button" className="review-back-button" onClick={onBack}>
          BACK
        </button>

        <button
          type="button"
          className="review-place-order-button"
          onClick={onPlaceOrder}
        >
          PLACE ORDER
        </button>
      </div>
    </section>
  );
}

export default ReviewSection;

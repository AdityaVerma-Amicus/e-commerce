import { useMemo } from "react";

import { useCartContext } from "../../context/CartContext";

import type {
  ShippingMethod,
} from "../../types/orders";

import "./OrderSummary.css";

interface OrderSummaryProps {
  shippingMethod:
    | ShippingMethod
    | "";
}

const SHIPPING_RATES: Record<
  ShippingMethod,
  number
> = {
  standard: 5,
  express: 15,
  overnight: 25,
};

const TAX_RATE = 0.08;

function OrderSummary({
  shippingMethod,
}: OrderSummaryProps) {
  const { subtotal } =
    useCartContext();

  const shippingCost = useMemo(() => {
    if (!shippingMethod) {
      return 0;
    }

    return SHIPPING_RATES[
      shippingMethod
    ];
  }, [shippingMethod]);

  const tax = useMemo(() => {
    return subtotal * TAX_RATE;
  }, [subtotal]);

  const total = useMemo(() => {
    return (
      subtotal +
      shippingCost +
      tax
    );
  }, [
    subtotal,
    shippingCost,
    tax,
  ]);

  return (
    <aside className="order-summary">
      <h2>Order Summary</h2>

      <div className="order-summary-details">
        <div className="order-summary-row">
          <span>Subtotal</span>

          <strong>
            ${subtotal.toFixed(2)}
          </strong>
        </div>

        <div className="order-summary-row">
          <span>Shipping</span>

          <strong>
            ${shippingCost.toFixed(2)}
          </strong>
        </div>

        <div className="order-summary-row">
          <span>Tax</span>

          <strong>
            ${tax.toFixed(2)}
          </strong>
        </div>

        <div className="order-summary-total">
          <span>Total</span>

          <strong>
            ${total.toFixed(2)}
          </strong>
        </div>
      </div>
    </aside>
  );
}

export default OrderSummary;
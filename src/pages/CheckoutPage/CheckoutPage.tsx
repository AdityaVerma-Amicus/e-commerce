import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCartContext } from "../../context/CartContext";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";
import CheckoutSteps from "../../components/Checkout/CheckoutSteps";

import ShippingForm, {
  type ShippingFormData,
} from "../../components/ShippingForm/ShippingForm";

import PaymentForm, {
  type PaymentFormData,
} from "../../components/Checkout/PaymentForm";

import OrderSummary from "../../components/Checkout/OrderSummary";
import ReviewSection from "../../components/Checkout/ReviewSection";
import { saveOrder } from "../../services/orderServices";

import type { Order } from "../../types/orders";
import SEO from "../../components/SEO/SEO";
import "./CheckoutPage.css";

type CheckoutStep = "shipping" | "payment" | "review";

const SHIPPING_RATES = {
  standard: 5,
  express: 15,
  overnight: 25,
} as const;

const STEP_LABELS: Record<CheckoutStep, string> = {
  shipping: "Shipping information",
  payment: "Payment information",
  review: "Review your order",
};

function CheckoutPage() {
  const {
    items,
    shippingMethod,
    setShippingMethod,
    subtotal,
    clearCart,
    isLoading,
  } = useCartContext();

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");

  const [shippingData, setShippingData] =
    useState<ShippingFormData | null>(null);

  const [paymentData, setPaymentData] =
    useState<PaymentFormData | null>(null);

  const checkoutSectionRef = useRef<HTMLElement>(null);
  const previousStepRef = useRef<CheckoutStep>("shipping");

  useEffect(() => {
    if (previousStepRef.current !== currentStep) {
      previousStepRef.current = currentStep;
      checkoutSectionRef.current?.focus();
    }
  }, [currentStep]);

  useEffect(() => {
    if (isLoading || items.length > 0) {
      return;
    }

    navigate("/products", { replace: true });
  }, [items.length, isLoading, navigate]);

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data);
    setCurrentStep("review");
  };

  const handlePlaceOrder = () => {
    if (!shippingData || !paymentData) {
      return;
    }

    const selectedShippingMethod = shippingData.shippingMethod;

    if (!selectedShippingMethod) {
      return;
    }

    const shippingCost = SHIPPING_RATES[selectedShippingMethod];
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const order: Order = {
      items: [...items],
      shipping: selectedShippingMethod,
      total,
      date: new Date().toISOString(),
      status: "Processing",
    };

    saveOrder(order);
    clearCart();

    navigate("/orders", { replace: true });
  };

  if (isLoading) {
    return (
      <PageContainer className="checkout-page-container">
        <main className="checkout-page">
          <h1 className="checkout-loading" role="status" aria-live="polite">
            Loading checkout...
          </h1>
        </main>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <SEO
        title="Checkout | E-Commerce"
        description="Complete your shipping and payment details to place your order."
        canonicalPath="/checkout"
        noIndex
      />

      <PageContainer className="checkout-page-container">
        <main className="checkout-page">
          <div className="checkout-title">
            <h1>Checkout</h1>
          </div>

          <CheckoutSteps currentStep={currentStep} />

          <div className="checkout-card">
            <div className="checkout-layout">
              <section
                ref={checkoutSectionRef}
                className="checkout-form-section"
                tabIndex={-1}
                aria-label={`Checkout step: ${STEP_LABELS[currentStep]}`}
              >
                <p className="sr-only" role="status" aria-live="polite">
                  Step {currentStep === "shipping" ? 1 : currentStep === "payment" ? 2 : 3} of 3:{" "}
                  {STEP_LABELS[currentStep]}
                </p>

                {currentStep === "shipping" && (
                  <ShippingForm
                    onSubmit={handleShippingSubmit}
                    shippingMethod={shippingMethod}
                    onShippingMethodChange={setShippingMethod}
                  />
                )}

                {currentStep === "payment" && (
                  <PaymentForm
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setCurrentStep("shipping")}
                  />
                )}

                {currentStep === "review" && (
                  <ReviewSection
                    shippingData={shippingData}
                    paymentData={paymentData}
                    items={items}
                    onBack={() => setCurrentStep("payment")}
                    onPlaceOrder={handlePlaceOrder}
                  />
                )}
              </section>

              <section
                className="checkout-summary-section"
                aria-label="Order summary"
              >
                <OrderSummary shippingMethod={shippingMethod} />
              </section>
            </div>
          </div>
        </main>
      </PageContainer>
    </>
  );
}

export default CheckoutPage;

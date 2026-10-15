import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCartContext } from "../../context/CartContext";

import PageContainer from "../../components/Layout/PageContainer/PageContainer";

import CheckoutSteps from "../../components/Checkout/CheckoutSteps";
import CheckoutSkeleton from "../../components/Checkout/CheckoutSkeleton";

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

  const [shippingData, setShippingData] = useState<ShippingFormData | null>(
    null,
  );

  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty.");

      navigate("/products", {
        replace: true,
      });
    }
  }, [items, isLoading, navigate]);

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

    console.log("Order placed successfully:", {
      order,

      shippingDetails: shippingData,

      paymentDetails: {
        cardholderName: paymentData.cardholderName,

        cardNumber: `**** **** **** ${paymentData.cardNumber.slice(-4)}`,

        expiryDate: paymentData.expiryDate,
      },

      pricing: {
        subtotal,
        shipping: shippingCost,
        tax,
        total,
      },
    });

    clearCart();

    alert("Order placed successfully!");

    navigate("/orders");
  };

  // PRODUCTION: Display the skeleton while cart data is loading.
  if (isLoading) {
    return (
      <>
        <SEO
          title="Checkout | E-Commerce"
          description="Complete your shipping and payment details to place your order."
          canonicalPath="/checkout"
          noIndex
        />

        <PageContainer className="checkout-page-container">
          <CheckoutSkeleton />
        </PageContainer>
      </>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const stepAnnouncement = {
    shipping: "Step 1 of 3: Shipping",
    payment: "Step 2 of 3: Payment",
    review: "Step 3 of 3: Review",
  }[currentStep];

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
          {/* CHECKOUT HEADER */}
          <div className="checkout-title">
            <h1>Checkout</h1>
          </div>

          {/* CHECKOUT STEPS */}
          <CheckoutSteps currentStep={currentStep} />

          {/* Screen-reader announcement; does not affect visual layout */}
          <p className="sr-only" role="status" aria-live="polite">
            {stepAnnouncement}
          </p>

          {/* CHECKOUT CARD */}
          <div className="checkout-card">
            <div className="checkout-layout">
              {/* CHECKOUT CONTENT */}
              <section className="checkout-form-section">
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

              {/* ORDER SUMMARY */}
              <section className="checkout-summary-section">
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

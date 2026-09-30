import "./CheckoutSteps.css";
interface CheckoutStepsProps {
  currentStep:
    | "shipping"
    | "payment"
    | "review";
}

function CheckoutSteps({
  currentStep,
}: CheckoutStepsProps) {
  const steps = [
    {
      id: "shipping",
      label: "Shipping",
    },
    {
      id: "payment",
      label: "Payment",
    },
    {
      id: "review",
      label: "Review",
    },
  ] as const;

  const currentIndex =
    steps.findIndex(
      (step) =>
        step.id === currentStep,
    );

  return (
    <div className="checkout-steps">
      {steps.map((step, index) => {
        const isActive =
          index === currentIndex;

        const isCompleted =
          index < currentIndex;

        return (
          <div
            key={step.id}
            className={`checkout-step ${
              isActive
                ? "active"
                : ""
            } ${
              isCompleted
                ? "completed"
                : ""
            }`}
          >
            <div className="step-number">
              {isCompleted
                ? "✓"
                : index + 1}
            </div>

            <span>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default CheckoutSteps;
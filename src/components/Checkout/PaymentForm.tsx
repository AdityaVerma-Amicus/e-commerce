import { useState } from "react";
import "./PaymentForm.css";
export interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onBack: () => void;
}

const initialFormData: PaymentFormData = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
};

function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentFormData, string>>
  >({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required.";
    }

    const cardNumber = formData.cardNumber.replace(/\s/g, "");

    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = "Card number must contain 16 digits.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Use MM/YY format.";
    }
    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must contain 3 digits.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Payment Information</h2>

      <div className="payment-method">
        <label>
          <input type="radio" name="paymentMethod" checked readOnly />
          Credit Card
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="cardholderName">Cardholder Name *</label>

        <input
          id="cardholderName"
          name="cardholderName"
          type="text"
          value={formData.cardholderName}
          onChange={handleChange}
          placeholder="Enter cardholder name"
        />

        {errors.cardholderName && (
          <p className="form-error">{errors.cardholderName}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="cardNumber">Card Number *</label>

        <input
          id="cardNumber"
          name="cardNumber"
          type="text"
          inputMode="numeric"
          maxLength={19}
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
        />

        {errors.cardNumber && <p className="form-error">{errors.cardNumber}</p>}
      </div>

      <div className="payment-row">
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date *</label>

          <input
            id="expiryDate"
            name="expiryDate"
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
          />

          {errors.expiryDate && (
            <p className="form-error">{errors.expiryDate}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV *</label>

          <input
            id="cvv"
            name="cvv"
            type="password"
            inputMode="numeric"
            maxLength={3}
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
          />

          {errors.cvv && <p className="form-error">{errors.cvv}</p>}
        </div>
      </div>

      <div className="payment-actions">
        <button type="button" onClick={onBack}>
          BACK
        </button>

        <button type="submit">CONTINUE TO REVIEW</button>
      </div>
    </form>
  );
}

export default PaymentForm;

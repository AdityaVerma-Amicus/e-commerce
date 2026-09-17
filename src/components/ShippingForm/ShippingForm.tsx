import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type SyntheticEvent,
} from "react";

import {
  fetchCities,
  fetchCountries,
  fetchStates,
  type City,
  type Country,
  type State,
} from "../../services/locationService";

import "./ShippingForm.css";

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  aptSuite: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shippingMethod: string;
}

interface ShippingFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  shippingMethod?: string;
}

const CUSTOM_CITY_VALUE = "__custom__";

const initialFormData: ShippingFormData = {
  fullName: "",
  email: "",
  phone: "",
  streetAddress: "",
  aptSuite: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  shippingMethod: "",
};

function ShippingForm() {
  const [formData, setFormData] = useState<ShippingFormData>(initialFormData);
  const [errors, setErrors] = useState<ShippingFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [customCity, setCustomCity] = useState("");
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  /*
   * Fetch Countries
   */
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        setCountryError("");

        const data = await fetchCountries();

        setCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries:", error);

        setCountries([]);

        setCountryError("Unable to load countries. Please try again.");
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  /*
   * Fetch States
   */
  useEffect(() => {
    if (!formData.country) {
      setStates([]);
      setIsLoadingStates(false);
      return;
    }

    const loadStates = async () => {
      try {
        setIsLoadingStates(true);
        setStateError("");

        const data = await fetchStates(formData.country);

        setStates(data);
      } catch (error) {
        console.error("Failed to fetch states:", error);

        setStates([]);

        setStateError("Unable to load states. Please try again.");
      } finally {
        setIsLoadingStates(false);
      }
    };

    loadStates();
  }, [formData.country]);

  /*
   * Fetch Cities
   *
   * Cities are fetched only after both
   * country and state have been selected.
   */
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setCities([]);
      setIsLoadingCities(false);
      return;
    }

    const loadCities = async () => {
      try {
        setIsLoadingCities(true);
        setCityError("");
        setCities([]);

        const data = await fetchCities(formData.country, formData.state);

        setCities(data);

        if (data.length === 0) {
          setCityError("No cities found. You can enter the city manually.");
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);

        setCities([]);

        setCityError("Unable to load cities. You can enter the city manually.");
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [formData.country, formData.state]);

  /*
   * Handle Input / Select Changes
   */
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    /*
     * Country changed
     */
    if (name === "country") {
      setFormData((previousData) => ({
        ...previousData,
        country: value,
        state: "",
        city: "",
      }));

      setStates([]);
      setCities([]);

      setIsCustomCity(false);
      setCustomCity("");

      setCountryError("");
      setStateError("");
      setCityError("");

      setErrors((previousErrors) => ({
        ...previousErrors,
        country: undefined,
        state: undefined,
        city: undefined,
      }));

      setIsSubmitted(false);

      return;
    }

    /*
     * State changed
     */
    if (name === "state") {
      setFormData((previousData) => ({
        ...previousData,
        state: value,
        city: "",
      }));

      setCities([]);

      setIsCustomCity(false);
      setCustomCity("");

      setStateError("");
      setCityError("");

      setErrors((previousErrors) => ({
        ...previousErrors,
        state: undefined,
        city: undefined,
      }));

      setIsSubmitted(false);

      return;
    }

    /*
     * City changed
     */
    if (name === "city") {
      if (value === CUSTOM_CITY_VALUE) {
        setIsCustomCity(true);

        setFormData((previousData) => ({
          ...previousData,
          city: "",
        }));
      } else {
        setIsCustomCity(false);

        setFormData((previousData) => ({
          ...previousData,
          city: value,
        }));
      }

      setCustomCity("");

      setErrors((previousErrors) => ({
        ...previousErrors,
        city: undefined,
      }));

      setCityError("");
      setIsSubmitted(false);

      return;
    }

    /*
     * Regular Input
     */
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setIsSubmitted(false);
  };

  /*
   * Handle Custom City
   */
  const handleCustomCityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setCustomCity(value);

    setFormData((previousData) => ({
      ...previousData,
      city: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      city: undefined,
    }));

    setIsSubmitted(false);
  };

  /*
   * Validate Form
   */
  const validateForm = (): ShippingFormErrors => {
    const newErrors: ShippingFormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (formData.fullName.trim().length > 120) {
      newErrors.fullName = "Full Name must be 120 characters or less";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.trim().length > 20) {
      newErrors.phone = "Phone must be 20 characters or less";
    } else if (!/^[+\d\s()-]+$/.test(formData.phone.trim())) {
      newErrors.phone =
        "Phone can contain numbers, +, -, spaces, and parentheses only";
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP is required";
    } else if (!/^\d{5,6}$/.test(formData.zip.trim())) {
      newErrors.zip = "ZIP must be 5-6 digits";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!formData.shippingMethod) {
      newErrors.shippingMethod = "Shipping method is required";
    }

    return newErrors;
  };

  /*
   * Validate Individual Field on Blur
   */
  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = event.target;
    const validationErrors = validateForm();

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: validationErrors[name as keyof ShippingFormErrors],
    }));
  };

  /*
   * Form Validity
   */
  const isFormValid = Object.keys(validateForm()).length === 0;

  /*
   * Submit Form
   */
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    console.log("Shipping Form Data :", formData);

    setIsSubmitted(true);
    setFormData(initialFormData);
    setCustomCity("");
    setIsCustomCity(false);
    setErrors({});
    setStates([]);
    setCities([]);
  };

  return (
    <main className="shipping-form-container">
      <form className="shipping-form" onSubmit={handleSubmit}>
        <h1>Checkout</h1>

        {isSubmitted && (
          <p className="success-message">Checkout submitted successfully!</p>
        )}

        <section className="form-section">
          <h2>Shipping Information</h2>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              maxLength={120}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">
              Phone <span className="required">*</span>
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              maxLength={20}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          {/* Street Address */}
          <div className="form-group">
            <label htmlFor="streetAddress">
              Street Address <span className="required">*</span>
            </label>

            <input
              id="streetAddress"
              name="streetAddress"
              type="text"
              value={formData.streetAddress}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.streetAddress && (
              <p className="form-error">{errors.streetAddress}</p>
            )}
          </div>

          {/* Apt / Suite */}
          <div className="form-group">
            <label htmlFor="aptSuite">Apt/Suite (Optional)</label>

            <input
              id="aptSuite"
              name="aptSuite"
              type="text"
              value={formData.aptSuite}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="form-row">
            {/* Country */}
            <div className="form-group">
              <label htmlFor="country">
                Country <span className="required">*</span>
              </label>

              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoadingCountries}
              >
                <option value="">
                  {isLoadingCountries
                    ? "Loading countries..."
                    : "Select country"}
                </option>

                {countries.map((country) => (
                  <option key={country.id} value={country.iso2}>
                    {country.name}
                  </option>
                ))}
              </select>

              {errors.country && <p className="form-error">{errors.country}</p>}

              {countryError && <p className="form-error">{countryError}</p>}
            </div>

            {/* State */}
            <div className="form-group">
              <label htmlFor="state">
                State <span className="required">*</span>
              </label>

              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!formData.country || isLoadingStates}
              >
                <option value="">
                  {!formData.country
                    ? "Select country first"
                    : isLoadingStates
                      ? "Loading states..."
                      : "Select state"}
                </option>

                {states.map((state) => (
                  <option key={state.id} value={state.stateCode}>
                    {state.name}
                  </option>
                ))}
              </select>

              {errors.state && <p className="form-error">{errors.state}</p>}

              {stateError && <p className="form-error">{stateError}</p>}
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>

              {!isCustomCity ? (
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!formData.state || isLoadingCities}
                >
                  <option value="">
                    {!formData.state
                      ? "Select state first"
                      : isLoadingCities
                        ? "Loading cities..."
                        : "Select city"}
                  </option>

                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}

                  <option value={CUSTOM_CITY_VALUE}>
                    Other / Enter manually
                  </option>
                </select>
              ) : (
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={customCity}
                  onChange={handleCustomCityChange}
                  onBlur={handleBlur}
                  placeholder="Enter city name"
                />
              )}

              {errors.city && <p className="form-error">{errors.city}</p>}

              {cityError && <p className="form-error">{cityError}</p>}
            </div>

            {/* ZIP */}
            <div className="form-group">
              <label htmlFor="zip">
                ZIP <span className="required">*</span>
              </label>

              <input
                id="zip"
                name="zip"
                type="text"
                value={formData.zip}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.zip && <p className="form-error">{errors.zip}</p>}
            </div>
          </div>
        </section>

        {/* Shipping Method */}
        <section className="form-section">
          <h2>
            Shipping Method <span className="required">*</span>
          </h2>

          <div className="shipping-methods">
            <label>
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={formData.shippingMethod === "standard"}
                onChange={handleChange}
              />
              Standard ($5)
            </label>

            <label>
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={formData.shippingMethod === "express"}
                onChange={handleChange}
              />
              Express ($15)
            </label>

            <label>
              <input
                type="radio"
                name="shippingMethod"
                value="overnight"
                checked={formData.shippingMethod === "overnight"}
                onChange={handleChange}
              />
              Overnight ($25)
            </label>
            {errors.shippingMethod && (
              <p className="form-error">{errors.shippingMethod}</p>
            )}
          </div>
        </section>

        <button
          className="place-order-btn"
          type="submit"
          disabled={!isFormValid}
        >
          Submit Checkout
        </button>
      </form>
    </main>
  );
}

export default ShippingForm;

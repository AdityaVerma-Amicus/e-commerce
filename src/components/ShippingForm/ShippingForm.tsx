import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
} from "../../services/cachedLocationService";

import type { ShippingMethod } from "../../types/orders";

import "./ShippingForm.css";

export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  aptSuite: string;
  city: string;

  state: string;
  stateName: string;

  zip: string;

  country: string;
  countryName: string;

  shippingMethod: ShippingMethod | "";
}

/*
 * shippingMethod is owned by the parent (CheckoutPage) and arrives as a prop,
 * so it is NOT stored in local form state anymore. It is merged in on submit.
 */
type FormFields = Omit<ShippingFormData, "shippingMethod">;

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

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  shippingMethod: ShippingMethod | "";
  onShippingMethodChange: (method: ShippingMethod) => void;
}

const CUSTOM_CITY_VALUE = "__custom__";

const initialFormData: FormFields = {
  fullName: "",
  email: "",
  phone: "",
  streetAddress: "",
  aptSuite: "",
  city: "",

  state: "",
  stateName: "",

  zip: "",

  country: "",
  countryName: "",
};

const VALIDATED_FIELDS: ReadonlyArray<keyof ShippingFormErrors> = [
  "fullName",
  "email",
  "phone",
  "streetAddress",
  "city",
  "state",
  "zip",
  "country",
  "shippingMethod",
];

const SHIPPING_OPTIONS: ReadonlyArray<{
  value: ShippingMethod;
  label: string;
}> = [
  { value: "standard", label: "Standard ($5)" },
  { value: "express", label: "Express ($15)" },
  { value: "overnight", label: "Overnight ($25)" },
];

/*
 * Pure validation (module level) so it never changes identity and the
 * handlers that use it can stay stable across keystrokes.
 */
function validateField(
  fieldName: keyof ShippingFormErrors,
  data: FormFields,
  shippingMethod: ShippingMethod | "",
): string | undefined {
  switch (fieldName) {
    case "fullName": {
      const value = data.fullName.trim();

      if (!value) return "Full Name is required";
      if (value.length > 120) return "Full Name must be 120 characters or less";

      return undefined;
    }

    case "email": {
      const value = data.email.trim();

      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Enter a valid email address";
      }

      return undefined;
    }

    case "phone": {
      const value = data.phone.trim();

      if (!value) return "Phone is required";
      if (value.length > 20) return "Phone must be 20 characters or less";
      if (!/^[+\d\s()-]+$/.test(value)) {
        return "Phone can contain numbers, +, -, spaces, and parentheses only";
      }

      return undefined;
    }

    case "streetAddress":
      return data.streetAddress.trim()
        ? undefined
        : "Street Address is required";

    case "city":
      return data.city.trim() ? undefined : "City is required";

    case "state":
      return data.state.trim() ? undefined : "State is required";

    case "zip": {
      const value = data.zip.trim();

      if (!value) return "ZIP is required";
      if (!/^\d{5,6}$/.test(value)) return "ZIP must be 5-6 digits";

      return undefined;
    }

    case "country":
      return data.country.trim() ? undefined : "Country is required";

    case "shippingMethod":
      return shippingMethod ? undefined : "Shipping method is required";

    default:
      return undefined;
  }
}

/*
 * Memoized option lists.
 *
 * These only re-render when their list changes, so typing in any other
 * field no longer reconciles hundreds/thousands of <option> elements.
 */
const CountryOptions = memo(function CountryOptions({
  countries,
}: {
  countries: Country[];
}) {
  return (
    <>
      {countries.map((country) => (
        <option key={country.id} value={country.iso2}>
          {country.name}
        </option>
      ))}
    </>
  );
});

const StateOptions = memo(function StateOptions({
  states,
}: {
  states: State[];
}) {
  return (
    <>
      {states.map((state) => (
        <option key={state.id} value={state.stateCode}>
          {state.name}
        </option>
      ))}
    </>
  );
});

const CityOptions = memo(function CityOptions({ cities }: { cities: City[] }) {
  return (
    <>
      {cities.map((city) => (
        <option key={city.id} value={city.name}>
          {city.name}
        </option>
      ))}
    </>
  );
});

function ShippingForm({
  onSubmit,
  shippingMethod,
  onShippingMethodChange,
}: ShippingFormProps) {
  /*
   * One centralized form state (shippingMethod lives in the parent).
   */
  const [formData, setFormData] = useState<FormFields>(initialFormData);

  const [errors, setErrors] = useState<ShippingFormErrors>({});

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
   * Latest values for stable event handlers (blur / submit read from these
   * instead of closing over state, so their identity never changes).
   */
  const formDataRef = useRef(formData);
  const shippingMethodRef = useRef(shippingMethod);

  useEffect(() => {
    formDataRef.current = formData;
    shippingMethodRef.current = shippingMethod;
  }, [formData, shippingMethod]);

  /*
   * Fetch Countries (cached)
   */
  useEffect(() => {
    let cancelled = false;

    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        setCountryError("");

        const data = await fetchCountries();

        if (!cancelled) {
          setCountries(data);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch countries:", error);

        setCountries([]);
        setCountryError("Unable to load countries. Please try again.");
      } finally {
        if (!cancelled) {
          setIsLoadingCountries(false);
        }
      }
    };

    loadCountries();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Fetch States (cached)
   */
  useEffect(() => {
    if (!formData.country) {
      setStates([]);
      setIsLoadingStates(false);
      return;
    }

    let cancelled = false;

    const loadStates = async () => {
      try {
        setIsLoadingStates(true);
        setStateError("");

        const data = await fetchStates(formData.country);

        if (!cancelled) {
          setStates(data);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch states:", error);

        setStates([]);
        setStateError("Unable to load states. Please try again.");
      } finally {
        if (!cancelled) {
          setIsLoadingStates(false);
        }
      }
    };

    loadStates();

    return () => {
      cancelled = true;
    };
  }, [formData.country]);

  /*
   * Fetch Cities (cached)
   */
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setCities([]);
      setIsLoadingCities(false);
      return;
    }

    let cancelled = false;

    const loadCities = async () => {
      try {
        setIsLoadingCities(true);
        setCityError("");
        setCities([]);

        const data = await fetchCities(formData.country, formData.state);

        if (cancelled) return;

        setCities(data);

        if (data.length === 0) {
          setCityError("No cities found. You can enter the city manually.");
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch cities:", error);

        setCities([]);
        setCityError("Unable to load cities. You can enter the city manually.");
      } finally {
        if (!cancelled) {
          setIsLoadingCities(false);
        }
      }
    };

    loadCities();

    return () => {
      cancelled = true;
    };
  }, [formData.country, formData.state]);

  /*
   * Lookup maps (only rebuilt when the lists change).
   */
  const countryMap = useMemo(() => {
    const map = new Map<string, Country>();
    countries.forEach((country) => map.set(country.iso2, country));
    return map;
  }, [countries]);

  const stateMap = useMemo(() => {
    const map = new Map<string, State>();
    states.forEach((state) => map.set(state.stateCode, state));
    return map;
  }, [states]);

  /*
   * Clear one field's error. Returns the same object when there is nothing
   * to clear, so React skips the re-render entirely.
   */
  const clearError = useCallback((field: keyof ShippingFormErrors) => {
    setErrors((previousErrors) =>
      previousErrors[field]
        ? { ...previousErrors, [field]: undefined }
        : previousErrors,
    );
  }, []);

  /*
   * Handle Input / Select Changes
   * No longer depends on `errors`, so identity only changes when the
   * country/state lists load.
   */
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;

      /*
       * Country selection resets dependent fields.
       */
      if (name === "country") {
        const selectedCountry = countryMap.get(value);

        setFormData((previousData) => ({
          ...previousData,
          country: value,
          countryName: selectedCountry?.name ?? "",
          state: "",
          stateName: "",
          city: "",
        }));

        setIsCustomCity(false);
        setCustomCity("");

        setErrors((previousErrors) =>
          previousErrors.country || previousErrors.state || previousErrors.city
            ? {
                ...previousErrors,
                country: undefined,
                state: undefined,
                city: undefined,
              }
            : previousErrors,
        );

        return;
      }

      /*
       * State selection resets city.
       */
      if (name === "state") {
        const selectedState = stateMap.get(value);

        setFormData((previousData) => ({
          ...previousData,
          state: value,
          stateName: selectedState?.name ?? "",
          city: "",
        }));

        setIsCustomCity(false);
        setCustomCity("");

        setErrors((previousErrors) =>
          previousErrors.state || previousErrors.city
            ? { ...previousErrors, state: undefined, city: undefined }
            : previousErrors,
        );

        return;
      }

      /*
       * Custom city option.
       */
      if (name === "city" && value === CUSTOM_CITY_VALUE) {
        setIsCustomCity(true);
        setCustomCity("");

        setFormData((previousData) => ({
          ...previousData,
          city: "",
        }));

        clearError("city");

        return;
      }

      setFormData((previousData) => ({
        ...previousData,
        [name]: value,
      }));

      /*
       * Clear the field error as soon as the user starts correcting it.
       */
      clearError(name as keyof ShippingFormErrors);
    },
    [countryMap, stateMap, clearError],
  );

  /*
   * Handle Custom City
   */
  const handleCustomCityChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setCustomCity(value);

      setFormData((previousData) => ({
        ...previousData,
        city: value,
      }));

      clearError("city");
      setCityError("");
    },
    [clearError],
  );

  /*
   * Validate only the field that lost focus.
   * Stable identity: reads the latest values from refs.
   */
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const fieldName = event.target.name as keyof ShippingFormErrors;

      if (!VALIDATED_FIELDS.includes(fieldName)) {
        return;
      }

      const error = validateField(
        fieldName,
        formDataRef.current,
        shippingMethodRef.current,
      );

      setErrors((previousErrors) =>
        previousErrors[fieldName] === error
          ? previousErrors
          : { ...previousErrors, [fieldName]: error },
      );
    },
    [],
  );

  /*
   * Submit Form
   */
  const handleSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = formDataRef.current;
      const method = shippingMethodRef.current;

      const validationErrors: ShippingFormErrors = {};

      VALIDATED_FIELDS.forEach((field) => {
        const error = validateField(field, data, method);

        if (error) {
          validationErrors[field] = error;
        }
      });

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      onSubmit({ ...data, shippingMethod: method });
    },
    [onSubmit],
  );

  /*
   * Shipping Method Change (state lives in the parent)
   */
  const handleShippingMethodChange = useCallback(
    (method: ShippingMethod) => {
      onShippingMethodChange(method);
      clearError("shippingMethod");
    },
    [onShippingMethodChange, clearError],
  );

  return (
    <main className="shipping-form-container">
      <form className="shipping-form" onSubmit={handleSubmit}>
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
              autoComplete="name"
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
              autoComplete="email"
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
              type="tel"
              autoComplete="tel"
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
              autoComplete="address-line1"
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
              autoComplete="address-line2"
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

                <CountryOptions countries={countries} />
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

                <StateOptions states={states} />
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

                  <CityOptions cities={cities} />

                  <option value={CUSTOM_CITY_VALUE}>
                    Other / Enter manually
                  </option>
                </select>
              ) : (
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  autoFocus
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
                autoComplete="postal-code"
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
            {SHIPPING_OPTIONS.map(({ value, label }) => (
              <label key={value}>
                <input
                  type="radio"
                  name="shippingMethod"
                  value={value}
                  checked={shippingMethod === value}
                  onChange={() => handleShippingMethodChange(value)}
                />
                {label}
              </label>
            ))}

            {errors.shippingMethod && (
              <p className="form-error">{errors.shippingMethod}</p>
            )}
          </div>
        </section>

        <div className="shipping-form-actions">
          <button type="submit" className="continue-payment-btn">
            CONTINUE TO PAYMENT
          </button>
        </div>
      </form>
    </main>
  );
}

export default memo(ShippingForm);

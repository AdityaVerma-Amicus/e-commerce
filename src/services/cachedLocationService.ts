/*
 * Thin caching layer over locationService.
 *
 * - Caches the in-flight/resolved Promise, so duplicate calls
 *   (StrictMode double effects, going back to step 1) share one request.
 * - Failed requests are evicted so the user can retry.
 *
 * Place next to locationService.ts (src/services/) and import from here
 * instead of "./locationService" in ShippingForm.
 */
import {
  fetchCities as fetchCitiesRaw,
  fetchCountries as fetchCountriesRaw,
  fetchStates as fetchStatesRaw,
  type City,
  type Country,
  type State,
} from "./locationService";

export type { City, Country, State };

let countriesPromise: Promise<Country[]> | null = null;
const statesCache = new Map<string, Promise<State[]>>();
const citiesCache = new Map<string, Promise<City[]>>();

export function fetchCountries(): Promise<Country[]> {
  if (!countriesPromise) {
    countriesPromise = fetchCountriesRaw().catch((error) => {
      countriesPromise = null;
      throw error;
    });
  }

  return countriesPromise;
}

export function fetchStates(countryCode: string): Promise<State[]> {
  let promise = statesCache.get(countryCode);

  if (!promise) {
    promise = fetchStatesRaw(countryCode).catch((error) => {
      statesCache.delete(countryCode);
      throw error;
    });

    statesCache.set(countryCode, promise);
  }

  return promise;
}

export function fetchCities(
  countryCode: string,
  stateCode: string,
): Promise<City[]> {
  const key = `${countryCode}:${stateCode}`;
  let promise = citiesCache.get(key);

  if (!promise) {
    promise = fetchCitiesRaw(countryCode, stateCode).catch((error) => {
      citiesCache.delete(key);
      throw error;
    });

    citiesCache.set(key, promise);
  }

  return promise;
}
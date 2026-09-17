const API_BASE_URL = "https://api.geocoded.me/v2";

interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    cursor: string | null;
  };
}

export interface Country {
  id: string;
  iso2: string;
  iso3: string;
  name: string;
}

export interface State {
  id: string;
  countryCode: string;
  stateCode: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  countryCode: string;
  stateCode: string;
}

const fetchApi = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

/*
 * Fetch Countries
 */
export const fetchCountries = async (): Promise<Country[]> => {
  const params = new URLSearchParams({
    limit: "300",
  });

  const result = await fetchApi<ApiResponse<Country>>(
    `${API_BASE_URL}/countries?${params}`,
  );

  return result.data;
};

/*
 * Fetch States
 */
export const fetchStates = async (countryCode: string): Promise<State[]> => {
  const params = new URLSearchParams({
    "filter[country]": countryCode,
    limit: "300",
  });

  const result = await fetchApi<ApiResponse<State>>(
    `${API_BASE_URL}/states?${params}`,
  );

  return result.data;
};

/*
 * Fetch Cities
 *
 * countryCode example: IN
 * stateCode example: MH
 *
 * The API expects the state CODE,
 * not the state NAME.
 */
export const fetchCities = async (
  countryCode: string,
  stateCode: string,
): Promise<City[]> => {
  const limit = 2000;
  let offset = 0;
  const allCities: City[] = [];

  while (true) {
    const params = new URLSearchParams({
      "filter[country]": countryCode,
      "filter[state]": stateCode,
      fields: "id,name,countryCode,stateCode",
      limit: String(limit),
      offset: String(offset),
    });

    const result = await fetchApi<ApiResponse<City>>(
      `${API_BASE_URL}/cities?${params}`,
    );

    allCities.push(...result.data);

    if (
      result.data.length === 0 ||
      !result.meta.hasMore ||
      allCities.length >= result.meta.total
    ) {
      break;
    }

    offset += result.data.length;
  }

  return allCities;
};

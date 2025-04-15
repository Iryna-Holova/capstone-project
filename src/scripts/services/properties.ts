import { CurrencyConverter } from "../models/CurrencyConverter";
import { ListingObject } from "../types/propertyParts";
import { ListingsResponse } from "../types/response";

const API_BASE = `${window.location.protocol}//${window.location.hostname}:3001`;

export const getAllProperties = async (
  filters: Record<string, (number | null)[] | string> = {}
): Promise<ListingObject[]> => {
  const filtersString = convertFiltersToString(filters);
  const res = await fetch(`${API_BASE}/listings?${filtersString}`);
  if (!res.ok) throw new Error("Error fetching properties");
  const data = await res.json();
  return data;
};

export const getPropertiesLimits = async (
  filters: Record<string, (number | null)[] | string> = {}
): Promise<Record<string, number>> => {
  const res = await getAllProperties(filters);
  const prices = res.map((item) => item.normalizedPrice[0]);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const areas = res.map((item) => item.size.totalArea);
  const maxArea = Math.max(...areas);
  const minArea = Math.min(...areas);

  return { maxPrice, minPrice, maxArea, minArea };
};

export const getProperties = async (
  page: number = 1,
  perPage: number = 10,
  sortBy: string = "postedAt",
  order: "asc" | "desc" = "desc",
  filters: Record<string, (number | null)[] | string> = {}
): Promise<ListingsResponse> => {
  const filtersString = convertFiltersToString(filters);

  const response = await fetch(
    `${API_BASE}/listings?_page=${page}&_per_page=${perPage}&_sort=${
      order === "desc" ? "-" : ""
    }${sortBy}${filtersString}`
  );
  if (!response.ok) throw new Error("Error fetching properties");

  const data = await response.json();
  return data;
};

export const getPropertyById = async (id: string): Promise<ListingObject> => {
  const response = await fetch(`${API_BASE}/listings/${id}`);
  if (!response.ok) throw new Error("Error fetching property");
  const data = await response.json();
  return data;
};

export const updateCurrencyRatesIfNeeded = async (
  converter: CurrencyConverter
) => {
  const metaRes = await fetch(`${API_BASE}/meta`);
  if (!metaRes.ok) return;
  const meta = await metaRes.json();

  const today = new Date();
  const lastUpdated = new Date(meta.lastUpdated);

  if (
    lastUpdated &&
    today.getFullYear() === lastUpdated.getFullYear() &&
    today.getMonth() === lastUpdated.getMonth() &&
    today.getDate() === lastUpdated.getDate()
  ) {
    return;
  }

  const listingsRes = await fetch(`${API_BASE}/listings`);
  if (!listingsRes.ok) return;

  const listingsData: ListingObject[] = await listingsRes.json();

  await Promise.all(
    listingsData.map(({ id, price }) => {
      const normalizedPrice = Math.round(
        converter.convertToUSD(price.currency, price.amount)
      );
      return fetch(`${API_BASE}/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          normalizedPrice: [normalizedPrice, normalizedPrice],
        }),
      });
    })
  );

  await fetch(`${API_BASE}/meta`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lastUpdated: today }),
  });
};

const convertFiltersToString = (
  filters: Record<string, (number | null)[] | string>
): string => {
  let filtersString = "";
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const name = key === "priceRange" ? "normalizedPrice" : "area";
      const [min, max] = value;
      filtersString += min ? `&${name}[0]_gte=${min}` : "";
      filtersString += max ? `&${name}[1]_lte=${max}` : "";
    } else {
      filtersString += `&${key}=${value}`;
    }
  });
  return filtersString;
};

import { ListingObject } from "./propertyParts";

export interface ListingsResponse {
  data: ListingObject[];
  first: number;
  last: number;
  items: number;
  next: number;
  pages: number;
  prev: number;
}

export interface CurrenciesResponse {
  date: string;
  usd: { [key: string]: number };
}

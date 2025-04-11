import { CurrenciesResponse } from "../types/response";

export const getCurrencyExchange = async (): Promise<{
  [key: string]: number;
}> => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
  );

  if (!response.ok) {
    throw new Error("Error fetching currency exchange rates");
  }

  const data: CurrenciesResponse = await response.json();
  return data.usd;
};

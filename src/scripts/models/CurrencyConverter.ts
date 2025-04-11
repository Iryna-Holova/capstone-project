import { CurrencyEnum, CurrencySymbols } from "../types/currency";
import { getCurrencyExchange } from "../services/currencyExchange";
import { updateCurrencyRatesIfNeeded } from "../services/properties";

export class CurrencyConverter {
  private static instance: CurrencyConverter;
  private currentCurrency: CurrencyEnum;
  private exchangeRatesToUSD: Record<string, number> = {};
  private currencySelector: HTMLSelectElement;
  private loaded = false;

  private constructor() {
    const savedCurrency = localStorage.getItem("selectedCurrency") as string;
    this.currentCurrency =
      savedCurrency && savedCurrency in CurrencyEnum
        ? CurrencyEnum[savedCurrency as keyof typeof CurrencyEnum]
        : CurrencyEnum.USD;
    this.currencySelector = document.getElementById(
      "currency"
    ) as HTMLSelectElement;
    this.currencySelector.value = this.currentCurrency;
    this.currencySelector.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      this.currentCurrency = target.value as CurrencyEnum;
      localStorage.setItem("selectedCurrency", this.currentCurrency);
      (document.querySelector("#priceRange") as HTMLElement)?.dispatchEvent(
        new Event("currencyChanged")
      );
      document.querySelectorAll("[data-currency]").forEach((element) => {
        const { currency, originalprice } = (element as HTMLDivElement).dataset;
        const [symbol, amount] = this.convert(
          currency as CurrencyEnum,
          parseInt(originalprice as string, 10)
        );

        element.textContent = `${symbol}${Math.round(amount).toLocaleString(
          "en-US"
        )}`;
      });
    });
  }

  static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter();
    }
    return CurrencyConverter.instance;
  }

  async loadData(): Promise<void> {
    if (this.loaded) return;
    const savedRates = localStorage.getItem("exchangeRates");
    if (savedRates) {
      const rates = JSON.parse(savedRates) as {
        date: string;
        rates: { [key: string]: number };
      };
      if (
        new Date(rates["date"]).toDateString() === new Date().toDateString()
      ) {
        this.exchangeRatesToUSD = rates["rates"];
        return;
      }
    }
    try {
      const data = await this.fetchCurrencyExchangeRates();
      localStorage.setItem("exchangeRates", JSON.stringify(data));
      this.exchangeRatesToUSD = data.rates;
    } catch (error) {
      console.warn(error);
    }
    await updateCurrencyRatesIfNeeded(this);
    this.loaded = true;
  }

  private async fetchCurrencyExchangeRates(): Promise<{
    date: string;
    rates: { [key: string]: number };
  }> {
    const allRates = await getCurrencyExchange();
    const allowedCurrencies = Object.values(CurrencyEnum).map((currency) =>
      currency.toLowerCase()
    );

    const rates = Object.fromEntries(
      Object.entries(allRates).filter(([currency]) =>
        allowedCurrencies.includes(currency)
      )
    );
    return {
      date: new Date().toISOString(),
      rates,
    };
  }

  async updateCurrency(newCurrency: CurrencyEnum): Promise<void> {
    if (this.currentCurrency === newCurrency) return;

    this.currentCurrency = newCurrency;
    localStorage.setItem("selectedCurrency", newCurrency);
  }

  public convert(fromCurrency: CurrencyEnum, amount: number): [string, number] {
    const amountInUSD = this.convertToUSD(fromCurrency, amount);
    if (this.currentCurrency === CurrencyEnum.USD) {
      return [CurrencySymbols[this.currentCurrency], amountInUSD];
    }

    const rate = this.exchangeRatesToUSD[this.currentCurrency.toLowerCase()];
    if (!rate) {
      console.warn(`Rate for ${fromCurrency} not found`);
      return [CurrencySymbols[this.currentCurrency], amount];
    }
    return [CurrencySymbols[this.currentCurrency], amountInUSD * rate];
  }

  convertToUSD(fromCurrency: CurrencyEnum, amount: number): number {
    if (fromCurrency === CurrencyEnum.USD) {
      return amount;
    }

    const rate = this.exchangeRatesToUSD[fromCurrency.toLowerCase()];
    if (!rate) {
      console.warn(`Rate for ${fromCurrency} not found`);
      return amount;
    }
    return amount / rate;
  }

  getCurrentCurrency(): CurrencyEnum {
    return this.currentCurrency;
  }
}

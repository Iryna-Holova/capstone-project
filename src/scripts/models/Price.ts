import { CurrencyEnum } from "../types/currency";
import { CurrencyConverter } from "./CurrencyConverter";

export class Price {
  amount: number;
  currency: CurrencyEnum;

  constructor({ amount, currency }: Price) {
    this.amount = amount;
    this.currency = CurrencyEnum[currency];
  }

  format(locale: string = "en-US"): string {
    const converter = CurrencyConverter.getInstance();
    const [symbol, amount] = converter.convert(this.currency, this.amount);
    return symbol + Math.round(amount).toLocaleString(locale);
  }
}

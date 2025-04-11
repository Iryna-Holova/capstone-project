import { CurrencyConverter } from "./models/CurrencyConverter";
import { Header } from "./models/Header";
import { Router } from "./models/Router";

document.addEventListener("DOMContentLoaded", async () => {
  const header = new Header();
  CurrencyConverter.getInstance();
  new Router(header);
});

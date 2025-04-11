import { Price } from "../models/Price";

export const priceMarkup = (price: Price): string =>
  `<strong data-currency=${price.currency} data-originalprice=${
    price.amount
  } class="property-price">${price.format()}</strong>`;

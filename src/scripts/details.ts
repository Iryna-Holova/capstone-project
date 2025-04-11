import { propertyDetailsMarkup } from "./markup/propertyDetails";
import { CurrencyConverter } from "./models/CurrencyConverter";
import { getUrlParam } from "./utils/getUrlParam";

export const init = async () => {
  const propertyId = getUrlParam() as string;
  await CurrencyConverter.getInstance().loadData();
  propertyDetailsMarkup(propertyId);
};

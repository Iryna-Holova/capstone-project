import { CurrencyConverter } from "./models/CurrencyConverter";
import { activateFiltersBtn } from "./handlers/handleFiltersModal";
import { ListingGallery } from "./models/ListingGallery";
import { ListingTypeEnum } from "./types/propertyParts";

export const init = async () => {
  await CurrencyConverter.getInstance().loadData();
  const type = location.pathname.split("/").pop();
  new ListingGallery(type as keyof typeof ListingTypeEnum).init();
  activateFiltersBtn();
};

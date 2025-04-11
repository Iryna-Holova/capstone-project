import { BuildingDetails } from "../models/BuildingDetails";
import { Size } from "../types/propertyParts";
import { formatKey } from "../utils/formatData";

export const createKeyValueItems = (
  data: Size | BuildingDetails
): HTMLLIElement[] =>
  Object.entries(data)
    .map(([key, value]) => {
      if (!value) return null;
      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = formatKey(key);
      const valueElement = document.createElement("span");
      valueElement.textContent = value.toString();
      item.append(label, valueElement);
      return item;
    })
    .filter(Boolean) as HTMLLIElement[];

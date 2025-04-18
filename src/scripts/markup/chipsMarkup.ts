import { Details } from "../types/propertyParts";

export const chipsMarkup = (data: Details): string => {
  const spriteUrl = "/static/sprite.svg";

  return Object.entries(data)
    .map(([key, value]) =>
      value
        ? `<li>
            <svg width="16" height="16">
              <use href="${spriteUrl}#icon-${key}" />
            </svg>
            <span>${value} ${value > 1 ? key : key.slice(0, -1)}</span>
          </li>`
        : ""
    )
    .join("");
};

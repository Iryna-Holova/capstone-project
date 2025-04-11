import spriteUrl from "../../assets/sprite.svg";

export const locationMarkup = (location: string): string =>
  `<svg width="20" height="20">
    <use href="${spriteUrl}#icon-location" />
  </svg>
  <span>${location}</span>`;

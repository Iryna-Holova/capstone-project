export const locationMarkup = (location: string): string => {
  const spriteUrl = "/static/sprite.svg";

  return `<svg width="20" height="20">
    <use href="${spriteUrl}#icon-location" />
  </svg>
  <span>${location}</span>`;
};

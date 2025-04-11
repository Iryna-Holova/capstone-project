import spriteUrl from "../../assets/sprite.svg";

export const metaInfoMarkup = (
  date: string,
  views: number,
  favorites: number
): string => `
  <span>
    <span>${views}</span>
    <svg width="16" height="16">
      <use href="${spriteUrl}#icon-eye" />
    </svg>
  </span>
  <span>
    <span>${favorites}</span>
    <svg width="16" height="16">
      <use href="${spriteUrl}#icon-heart" />
    </svg>
  </span>
  <span>Posted ${date}</span>
  `;

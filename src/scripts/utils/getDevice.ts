export const isMobile = (): boolean =>
  document.documentElement.clientWidth < 768;

export const isTablet = (): boolean =>
  document.documentElement.clientWidth >= 768 &&
  document.documentElement.clientWidth < 1024;

export const isRetina = (): boolean => window.devicePixelRatio >= 2;

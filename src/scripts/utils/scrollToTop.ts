export const scrollElementToTop = (element: HTMLElement): void => {
  const containerRect = element.getBoundingClientRect();
  const isTopVisible =
    containerRect.top >= 0 && containerRect.top <= window.innerHeight;
  if (isTopVisible) return;
  element.scrollIntoView();
};

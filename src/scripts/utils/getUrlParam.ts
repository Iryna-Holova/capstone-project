export const getUrlParam = (): string | null => {
  return window.location.pathname.split("/").pop() || null;
};

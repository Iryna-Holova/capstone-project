export const showMessage = (
  message: string,
  type: "success" | "error"
): void => {
  alert(type + ": " + message);
};

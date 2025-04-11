export const labelsMarkup = (
  data: [string | boolean, (string | number)?][]
): string =>
  data
    .map(([key, value]) => {
      if (!key) return "";
      if (!value) return `<li>${key}</li>`;
      return `<li><span>${key}</span> <span>${value}</span></li>`;
    })
    .join("");

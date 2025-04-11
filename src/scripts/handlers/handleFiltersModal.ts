import { isMobile } from "../utils/isMobile";

export const activateFiltersBtn = () => {
  const filtersBtn = document.querySelector("#filters") as HTMLButtonElement;
  filtersBtn.addEventListener("click", handleFilterBtn);
};

const handleFilterBtn = () => {
  const filters = document.querySelector(
    "#filters-container"
  ) as HTMLDivElement;
  filters.setAttribute("data-open", "true");

  const documentElement = document.documentElement;
  if (isMobile()) documentElement.classList.add("no-scroll");
  const backdrop = document.querySelector(
    "#filters-backdrop"
  ) as HTMLDivElement;
  backdrop.classList.add("visible");
  if (isMobile()) backdrop.classList.add("colored");

  const closeBtns = filters.querySelectorAll(".js-close") as NodeList;

  const handleClose = () => {
    filters.setAttribute("data-open", "false");
    documentElement.classList.remove("no-scroll");
    setTimeout(() => {
      filters.scrollTo(0, 0);
    }, 500);

    backdrop.classList.remove("visible", "colored");

    closeBtns.forEach((element) =>
      element.removeEventListener("click", handleClose)
    );
    backdrop.removeEventListener("click", handleClose);
  };

  backdrop.addEventListener("click", handleClose);
  closeBtns.forEach((element) =>
    element.addEventListener("click", handleClose)
  );
};

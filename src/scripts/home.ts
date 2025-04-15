import { ImageSlider } from "./models/ImageSlider";
import { isRetina as checkRetina, isMobile, isTablet } from "./utils/getDevice";

export const init = () => {
  let imagePath: string;
  const isRetina = checkRetina();
  if (isMobile()) {
    imagePath = isRetina
      ? "/static/images/slider-mobile-5@2x.webp"
      : "/static/images/slider-mobile-5.webp";
  } else if (isTablet()) {
    imagePath = isRetina
      ? "/static/images/slider-tablet-5@2x.webp"
      : "/static/images/slider-tablet-5.webp";
  } else {
    imagePath = isRetina
      ? "/static/images/slider-desktop-5@2x.webp"
      : "/static/images/slider-desktop-5.webp";
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = imagePath;
  link.setAttribute("fetchpriority", "high");
  document.head.appendChild(link);
  new ImageSlider();
};

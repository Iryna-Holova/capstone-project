import { ImageGallery } from "../models/ImageGallery";
import { PropertyListing } from "../models/PropertyListing";
import { initMap } from "../services/maps";
import { getPropertyById } from "../services/properties";
import { ListingObject } from "../types/propertyParts";
import { scrollElementToTop } from "../utils/scrollToTop";
import { chipsMarkup } from "./chipsMarkup";
import { contactMarkup } from "./contactMarkup";
import { createKeyValueItems } from "./createKeyValueItems";
import { labelsMarkup } from "./labelsMarkup";
import { locationMarkup } from "./locationMarkup";
import { metaInfoMarkup } from "./metaInfoMarkup";
import { priceMarkup } from "./priceMarkup";

export const propertyDetailsMarkup = async (propertyId: string) => {
  const backLink = document.querySelector("#back") as HTMLAnchorElement;
  const title = document.querySelector("#title") as HTMLHeadingElement;
  const location = document.querySelector("#location") as HTMLAnchorElement;
  const details = document.querySelector("#details") as HTMLUListElement;
  const labels = document.querySelector("#labels") as HTMLUListElement;
  const size = document.querySelector("#size") as HTMLUListElement;
  const buildingDetails = document.querySelector(
    "#buildingDetails"
  ) as HTMLUListElement;
  const price = document.querySelector("#price") as HTMLDivElement;
  const contactBtn = document.querySelector("#contactBtn") as HTMLButtonElement;
  const description = document.querySelector("#description") as HTMLDivElement;
  const meta = document.querySelector("#meta") as HTMLParagraphElement;
  const days = document.querySelector("#days-ago") as HTMLParagraphElement;
  const contact = document.querySelector("#contact") as HTMLDivElement;
  scrollElementToTop(backLink.parentElement?.parentElement as HTMLElement);

  getPropertyById(propertyId).then((data: ListingObject) => {
    const property = new PropertyListing(data);
    const position = {
      lat: data.location.coords.latitude,
      lng: data.location.coords.longitude,
    };
    initMap(position);
    backLink.textContent = `gallery / ${data.type} / `;
    backLink.href = `/gallery/${data.type}`;
    (backLink.nextElementSibling as HTMLElement).textContent = data.title;

    new ImageGallery(data.images, data.title);
    title.textContent = data.title;
    location.innerHTML = locationMarkup(property.fullAddress);
    details.innerHTML = chipsMarkup(data.details);
    labels.innerHTML = labelsMarkup([
      [data.propertyType],
      [data.features.furnishing],
      [`${data.features.heating} heating`],
      [data.features.parking !== "None" && `${data.features.parking} parking`],
      [data.features.balcony && "Balcony"],
    ]);
    size.append(...createKeyValueItems(data.size));
    buildingDetails.append(...createKeyValueItems(data.buildingDetails));
    price.innerHTML = priceMarkup(property.price);
    description.textContent = data.description;
    meta.innerHTML = metaInfoMarkup(
      property.formatDate(),
      property.views,
      property.favorites
    );
    days.textContent = property.daysAgo();
    contact.innerHTML = contactMarkup(property.contact);

    location.addEventListener("click", (event: Event) => {
      event.preventDefault();
      document.querySelector("#map")?.scrollIntoView({ behavior: "smooth" });
    });
    contactBtn.addEventListener("click", (event: Event) => {
      event.preventDefault();
      contact.scrollIntoView({ behavior: "smooth" });
    });
  });
};

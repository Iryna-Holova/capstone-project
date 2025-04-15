import { PropertyListing } from "../models/PropertyListing";
import { chipsMarkup } from "./chipsMarkup";
import { labelsMarkup } from "./labelsMarkup";
import { locationMarkup } from "./locationMarkup";
import { metaInfoMarkup } from "./metaInfoMarkup";
import { priceMarkup } from "./priceMarkup";

export const galleryItemMarkup = (property: PropertyListing) => {
  const spriteUrl = "/static/sprite.svg";

  return `
    <li>
      <article class="listings-item">
        <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
        <header class="listings-item-header">
          <h3 class="listings-item-title">${property.title}</h3>
          <p class="property-location">
            ${locationMarkup(property.fullAddress)}
          </p>
        </header>
        <div class="listings-item-features">
          <ul class="property-chips">
            <li>
              <svg width="16" height="16"><use href="${spriteUrl}#icon-area" /></svg>
              <span>${property.size.totalArea} sqmt</span>
            </li>
            ${chipsMarkup(property.details)}
          </ul>
          <ul class="property-labels">
          ${labelsMarkup([
            ["Type", property.propertyType],
            ["Contact", property.contact.type],
            ["Built in", property.buildingDetails.yearBuilt],
            [property.features.furnishing],
          ])}
          </ul>
        </div>
        <footer class="listings-item-footer">
          <a data-spa-link href="/gallery/${property.type}/details/${
    property.id
  }" class="btn-medium primary">Details</a>
          ${priceMarkup(property.price)}
          <p class="listings-item-meta">
            ${metaInfoMarkup(
              property.formatDate(),
              property.views,
              property.favorites
            )}
          </p>
        </footer>
        <button type="button" class="property-like-btn" aria-label="Add to favorites">
          <svg width="24" height="24">
            <use href="${spriteUrl}#icon-heart" />
          </svg>
        </button>
      </article>
    </li>`;
};

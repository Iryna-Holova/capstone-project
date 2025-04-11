import { galleryItemMarkup } from "../markup/galleryItemMarkup";
import {
  Contact,
  Details,
  ListingObject,
  ListingStatusEnum,
  ListingTypeEnum,
  Location,
  PropertyTypeEnum,
  Size,
} from "../types/propertyParts";
import { BuildingDetails } from "./BuildingDetails";
import { Features } from "./Features";
import { Price } from "./Price";

export class PropertyListing {
  id: string;
  type: ListingTypeEnum;
  propertyType: PropertyTypeEnum;
  title: string;
  description: string;
  price: Price;
  location: Location;
  size: Size;
  images: string[];
  contact: Contact;
  private postedAt: Date;
  details: Details;
  buildingDetails: BuildingDetails;
  features: Features;
  views: number;
  favorites: number;
  status: ListingStatusEnum;

  constructor(data: ListingObject) {
    this.id = data.id;
    this.type = data.type;
    this.propertyType = PropertyTypeEnum[data.propertyType];
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.price = new Price(data.price);
    this.size = data.size;
    this.images = data.images;
    this.details = data.details;
    this.buildingDetails = new BuildingDetails(data.buildingDetails);
    this.features = new Features(data.features);
    this.contact = data.contact;
    this.postedAt = new Date(data.postedAt);
    this.views = data.views;
    this.favorites = data.favorites;
    this.status = ListingStatusEnum[data.status];
  }

  formatDate(locale: string = "en-US"): string {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(this.postedAt);
  }

  daysAgo(): string {
    const today = new Date();
    const days = Math.round(
      (today.getTime() - this.postedAt.getTime()) / 86400000
    );
    return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
  }

  get fullAddress(): string {
    return `${this.location.address}, ${this.location.city}, ${this.location.country}`;
  }

  toCardHTML(): string {
    return galleryItemMarkup(this);
  }
}

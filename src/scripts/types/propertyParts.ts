import { BuildingDetails } from "../models/BuildingDetails";
import { Features } from "../models/Features";
import { Price } from "../models/Price";

export enum ListingTypeEnum {
  buy = "buy",
  rent = "rent",
}

export enum PropertyTypeEnum {
  Apartment = "Apartment",
  Commercial = "Commercial",
  House = "House",
  Studio = "Studio",
  Villa = "Villa",
}

export enum BuildingTypeEnum {
  Brick = "Brick",
  Glass = "Glass & Concrete",
  Monolithic = "Monolithic",
  Stone = "Stone",
  Wooden = "Wooden",
}

export enum ContactTypeEnum {
  Agency = "Agency",
  Developer = "Developer",
  Owner = "Owner",
}

export enum FurnishingEnum {
  Furnished = "Furnished",
  PartiallyFurnished = "Partially furnished",
  Unfurnished = "Unfurnished",
}

export enum ParkingEnum {
  Garage = "Garage",
  Private = "Private",
  Street = "Street",
  Underground = "Underground",
  None = "No parking",
}

export enum HeatingEnum {
  Autonomous = "Autonomous",
  Central = "Central",
  Electric = "Electric",
  Gas = "Gas",
  Geothermal = "Geothermal",
  Solar = "Solar",
}

export enum ListingStatusEnum {
  Active = "Active",
  Sold = "Sold",
  Rented = "Rented",
  Expired = "Expired",
}

export interface Location {
  country: string;
  city: string;
  address: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}

export interface Size {
  totalArea: number;
  livingArea: number;
  kitchenArea: number;
  landArea: number;
}

export interface Details {
  rooms: number;
  baths: number;
  beds: number;
  garages: number;
}

export interface Contact {
  name: string;
  phone: string;
  email?: string;
  type: ContactTypeEnum;
}

export type ListingObject = {
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
  postedAt: string;
  details: Details;
  buildingDetails: BuildingDetails;
  features: Features;
  views: number;
  favorites: number;
  status: ListingStatusEnum;
  normalizedPrice: number[];
};

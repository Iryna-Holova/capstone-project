import {
  FurnishingEnum,
  HeatingEnum,
  ParkingEnum,
} from "../types/propertyParts";

export class Features {
  furnishing: FurnishingEnum | keyof typeof FurnishingEnum;
  heating: HeatingEnum;
  balcony: boolean;
  parking: ParkingEnum | keyof typeof ParkingEnum;

  constructor({ furnishing, heating, balcony, parking }: Features) {
    this.furnishing = FurnishingEnum[furnishing as keyof typeof FurnishingEnum];
    this.heating = HeatingEnum[heating];
    this.balcony = balcony;
    this.parking = ParkingEnum[parking as keyof typeof ParkingEnum];
  }
}

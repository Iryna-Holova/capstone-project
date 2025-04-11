import { BuildingTypeEnum } from "../types/propertyParts";

export class BuildingDetails {
  floor: number;
  totalFloors: number;
  yearBuilt: number;
  buildingType: BuildingTypeEnum;

  constructor({
    floor,
    totalFloors,
    yearBuilt,
    buildingType,
  }: BuildingDetails) {
    this.floor = floor;
    this.totalFloors = totalFloors;
    this.yearBuilt = yearBuilt;
    this.buildingType =
      BuildingTypeEnum[buildingType as keyof typeof BuildingTypeEnum];
  }
}

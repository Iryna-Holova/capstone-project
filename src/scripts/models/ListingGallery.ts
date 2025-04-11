import { paginationMarkup } from "../markup/paginationMarkup";
import { getProperties, getPropertiesLimits } from "../services/properties";
import { ListingTypeEnum } from "../types/propertyParts";
import { ListingsResponse } from "../types/response";
import { scrollElementToTop } from "../utils/scrollToTop";
import { showMessage } from "../utils/showMessage";
import { FilterForm } from "./FilterForm";
import { PropertyListing } from "./PropertyListing";

export class ListingGallery {
  container: HTMLDivElement;
  sortSelector: HTMLSelectElement;
  orderBtn: HTMLButtonElement;
  headingEl: HTMLElement;
  countEl: HTMLElement;
  listings: HTMLUListElement;
  pagination: HTMLDivElement;
  type: ListingTypeEnum;
  propertyType: string = "";
  page: number;
  perPage: number;
  order: "asc" | "desc";
  sortBy: "postedAt" | "normalizedPrice[0]" | "area[0]" | "favorites";
  filters: {
    [key: string]: (number | null)[] | string;
  } = {};
  limits: Record<string, number> = {};
  params: URLSearchParams;

  constructor(type: keyof typeof ListingTypeEnum) {
    this.type = ListingTypeEnum[type];
    this.container = document.querySelector("#gallery") as HTMLDivElement;
    this.sortSelector = document.querySelector("#sort") as HTMLSelectElement;
    this.orderBtn = document.querySelector("#order") as HTMLButtonElement;
    this.headingEl = document.getElementById("heading") as HTMLElement;
    this.countEl = document.querySelector("#count") as HTMLElement;
    this.listings = document.querySelector("#listings") as HTMLUListElement;
    this.pagination = document.querySelector("#pagination") as HTMLDivElement;

    const params = (this.params = new URLSearchParams(window.location.search));
    this.page = +(params.get("page") ?? 1);
    this.perPage = +(params.get("perPage") ?? 10);
    this.sortBy = (params.get("sortBy") as typeof this.sortBy) || "postedAt";
    this.order = (params.get("order") as typeof this.order) || "desc";
    const propertyType = params.get("propertyType");
    if (propertyType) {
      this.filters["propertyType"] = propertyType;
      this.propertyType = propertyType;
    }
    const priceRange = params.get("priceRange");
    if (priceRange)
      this.filters["priceRange"] = priceRange
        .split(",")
        .map((value) => (value ? Number(value) : null));
    const areaRange = params.get("areaRange");
    if (areaRange)
      this.filters["areaRange"] = areaRange
        .split(",")
        .map((value) => (value ? Number(value) : null));
    this.sortSelector.value = this.sortBy;
    this.orderBtn.dataset["order"] = this.order;

    this.sortSelector.addEventListener("change", this.handleSortChange);
    this.orderBtn.addEventListener("click", this.handleOrderChange);
    this.pagination.addEventListener("click", this.handlePageChange);
  }

  async init(): Promise<void> {
    const { maxPrice, minPrice, maxArea, minArea } = await getPropertiesLimits({
      type: ListingTypeEnum[this.type],
    });

    new FilterForm(
      {
        priceRange: [minPrice, maxPrice],
        areaRange: [minArea, maxArea],
      },
      this.filters,
      this.handleFilterChange
    );
    this.updateHeading();
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.container.classList.add("loading");
      const response = await getProperties(
        this.page,
        this.perPage,
        this.sortBy,
        this.order,
        {
          type: this.type,
          ...this.filters,
        }
      );
      this.render(response);
    } catch (error) {
      showMessage((error as Error).message, "error");
      this.updateCountEl(0);
      this.listings.innerHTML = "";
      this.pagination.innerHTML = "";
    } finally {
      this.container.classList.remove("loading");
    }
  }

  handlePageChange = (e: Event): void => {
    if (!(e.target instanceof Element)) return;
    const button = e.target.closest("button");
    if (!button) return;
    const { page } = button.dataset;
    if (!page || this.page === +page) return;

    this.page = +page;
    this.updateParams({ page: this.page });
    this.loadData();
    scrollElementToTop(this.container);
  };

  handleSortChange = (): void => {
    this.sortBy = this.sortSelector.value as typeof this.sortBy;
    this.page = 1;
    this.updateParams({ page: this.page, sortBy: this.sortBy });
    this.loadData();
  };

  handleOrderChange = (): void => {
    this.order = this.orderBtn.dataset["order"] =
      this.order === "desc" ? "asc" : "desc";
    this.page = 1;
    this.updateParams({ page: this.page, order: this.order });
    this.loadData();
  };

  handleFilterChange = (
    filters: Record<string, (number | null)[] | string>
  ): void => {
    this.filters = filters;
    this.page = 1;
    Array.from(this.params.keys()).forEach((key) => {
      if (!(key in this.filters) && key !== "sortBy" && key !== "order") {
        this.params.delete(key);
      }
    });
    this.updateParams({ page: this.page });
    for (const [key, value] of Object.entries(this.filters)) {
      if (Array.isArray(value)) {
        this.updateParams({ [key]: value.join(",") });
      } else {
        this.updateParams({ [key]: value });
      }
    }
    this.loadData();
    if (this.filters["propertyType"]) {
      if (this.propertyType !== this.filters["propertyType"]) {
        this.propertyType = this.filters["propertyType"] as string;
        this.updateHeading();
      }
    } else {
      if (this.propertyType) {
        this.propertyType = "";
        this.updateHeading();
      }
    }
    scrollElementToTop(this.container);
  };

  render({ data, pages, items }: ListingsResponse): void {
    this.updateCountEl(items);

    if (data.length === 0) {
      this.listings.innerHTML = "";
      this.pagination.innerHTML = "";
      return;
    }

    this.listings.innerHTML = data
      .map((item) => new PropertyListing(item).toCardHTML())
      .join("\n");

    this.pagination.innerHTML =
      pages > 1 ? paginationMarkup(this.page, pages) : "";
  }

  private updateCountEl(count: number): void {
    this.countEl.innerHTML =
      count === 0
        ? "No properties found"
        : `We found <strong>${count}</strong> ${
            count === 1 ? "property" : "properties"
          }`;
  }

  private updateHeading(): void {
    this.headingEl.textContent = `${
      this.propertyType ? this.propertyType : "Propertie"
    }s for ${this.type === "buy" ? "sale" : this.type}`;
  }

  private updateParams(newParams: {
    [key: string]: string | number | boolean;
  }): void {
    Object.entries(newParams).forEach(([key, value]) => {
      this.params.set(key, value.toString());
    });

    window.history.pushState(null, "", `?${this.params.toString()}`);
  }
}

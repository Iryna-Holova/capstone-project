import { CurrencyEnum } from "../types/currency";
import { CurrencyConverter } from "./CurrencyConverter";

export class RangeSlider {
  private name: string;
  private container: HTMLDivElement;
  private rangeInputs: HTMLInputElement[];
  private numberInputs: HTMLInputElement[];
  private rangeProgress: HTMLDivElement;
  private minGap: number;
  private minLimit: number;
  private maxLimit: number;
  private selectedMin: number;
  private selectedMax: number;
  private onChange;
  private currencyConverter?: CurrencyConverter;
  private currentCurrency?: CurrencyEnum;
  private initMin?: number;
  private initMax?: number;

  constructor(
    name: string,
    minLimit: number,
    maxLimit: number,
    onChange: (
      rangeName: string,
      min: number | null,
      max: number | null
    ) => boolean[],
    selectedMin: number | null,
    selectedMax: number | null
  ) {
    this.name = name;
    this.onChange = onChange;
    this.container = document.querySelector(`#${this.name}`) as HTMLDivElement;
    this.rangeInputs = Array.from(
      this.container.querySelectorAll("input[type=range]")
    );
    this.numberInputs = Array.from(
      this.container.querySelectorAll("input[type=number]")
    );
    this.rangeProgress = this.container.querySelector(
      ".slider .progress"
    ) as HTMLDivElement;

    if (this.name === "priceRange") {
      this.currencyConverter = CurrencyConverter.getInstance();
      this.currentCurrency = this.currencyConverter.getCurrentCurrency();
      this.container.addEventListener(
        "currencyChanged",
        this.handleCurrencyChange
      );
      this.initMin = minLimit;
      this.initMax = maxLimit;
      if (this.currentCurrency !== CurrencyEnum.USD) {
        const [symbol, convertedMin] = this.currencyConverter.convert(
          CurrencyEnum.USD,
          this.initMin
        );
        minLimit = Math.floor(convertedMin);
        maxLimit = Math.ceil(
          this.currencyConverter.convert(CurrencyEnum.USD, this.initMax)[1]
        );
        if (selectedMin)
          selectedMin = Math.floor(
            this.currencyConverter.convert(CurrencyEnum.USD, selectedMin)[1]
          );
        if (selectedMax)
          selectedMax = Math.ceil(
            this.currencyConverter.convert(CurrencyEnum.USD, selectedMax)[1]
          );
        (
          this.container.querySelector("[data-unit]") as HTMLSpanElement
        ).textContent = symbol;
      }
    }
    this.minLimit = minLimit;
    this.maxLimit = maxLimit;
    this.minGap = Math.round((this.maxLimit - this.minLimit) / 10);
    this.selectedMin = selectedMin
      ? Math.max(this.minLimit, selectedMin)
      : this.minLimit;
    this.selectedMax = selectedMax
      ? Math.min(this.maxLimit, selectedMax)
      : this.maxLimit;

    this.initialize();
  }

  private initialize(): void {
    this.rangeInputs[0].min =
      this.rangeInputs[1].min =
      this.numberInputs[0].min =
        this.minLimit.toString();

    this.numberInputs[1].min = (this.minLimit + this.minGap).toString();

    this.rangeInputs[0].max =
      this.rangeInputs[1].max =
      this.numberInputs[1].max =
        this.maxLimit.toString();

    this.numberInputs[0].max = (this.maxLimit - this.minGap).toString();

    this.rangeInputs[0].value = this.numberInputs[0].value =
      this.selectedMin.toString();
    this.rangeInputs[1].value = this.numberInputs[1].value =
      this.selectedMax.toString();

    this.updateProgress();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.numberInputs.forEach((input) => {
      input.addEventListener("input", this.handleNumberInput.bind(this));
      input.addEventListener("blur", this.handleNumberInputBlur.bind(this));
      input.addEventListener("change", this.handleChange.bind(this));
    });

    this.rangeInputs.forEach((input) => {
      input.addEventListener("input", this.handleRangeInput.bind(this));
      input.addEventListener("change", this.handleChange.bind(this));
    });
  }

  private handleChange(): void {
    let [minVal, maxVal] = this.rangeInputs.map((input) =>
      parseInt(input.value, 10)
    );
    this.selectedMin = minVal;
    this.selectedMax = maxVal;

    if (
      this.name === "priceRange" &&
      this.currencyConverter &&
      this.currentCurrency !== CurrencyEnum.USD
    ) {
      if (minVal !== this.minLimit) {
        minVal = Math.floor(
          this.currencyConverter.convertToUSD(
            this.currencyConverter.getCurrentCurrency(),
            minVal
          )
        );
      }
      if (maxVal !== this.maxLimit) {
        maxVal = Math.ceil(
          this.currencyConverter.convertToUSD(
            this.currencyConverter.getCurrentCurrency(),
            maxVal
          )
        );
      }
    }
    const changed = this.onChange(
      this.name,
      minVal === this.minLimit ? null : minVal,
      maxVal === this.maxLimit ? null : maxVal
    );

    changed.forEach((value, index) => {
      if (value) {
        this.numberInputs[index].classList.add("changed");
      } else {
        this.numberInputs[index].classList.remove("changed");
      }
    });
  }

  private handleNumberInputBlur(event: Event): void {
    const target = event.target as HTMLInputElement;
    const targetIndex = this.numberInputs.indexOf(target);
    const [minVal, maxVal] = this.numberInputs.map((input) =>
      parseInt(input.value, 10)
    );

    switch (targetIndex) {
      case 0:
        if (maxVal - minVal < this.minGap) {
          target.value = this.rangeInputs[0].value = (
            maxVal - this.minGap
          ).toString();
          this.updateProgress();
        } else if (minVal < this.minLimit) {
          target.value = this.rangeInputs[0].value = this.minLimit.toString();
          this.updateProgress();
        }
        break;
      case 1:
        if (maxVal - minVal < this.minGap) {
          target.value = this.rangeInputs[1].value = (
            minVal + this.minGap
          ).toString();
          this.updateProgress();
        } else if (maxVal > this.maxLimit) {
          target.value = this.rangeInputs[1].value = this.maxLimit.toString();
          this.updateProgress();
        }
        break;
      default:
        break;
    }
  }

  private handleNumberInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const targetIndex = this.numberInputs.indexOf(target);
    const [minVal, maxVal] = this.numberInputs.map((input) =>
      parseInt(input.value, 10)
    );

    if (maxVal - minVal >= this.minGap && maxVal <= this.maxLimit) {
      this.rangeInputs[targetIndex].value = target.value;
      this.updateProgress();
    }
  }

  private handleRangeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const targetIndex = this.rangeInputs.indexOf(target);
    const [minVal, maxVal] = this.rangeInputs.map((input) =>
      parseInt(input.value, 10)
    );

    if (maxVal - minVal < this.minGap) {
      this.rangeInputs[targetIndex].value = (
        targetIndex ? minVal + this.minGap : maxVal - this.minGap
      ).toString();
    } else {
      this.numberInputs[targetIndex].value = target.value;
      this.updateProgress();
    }
  }

  private updateProgress(): void {
    const [minVal, maxVal] = this.rangeInputs.map((input) =>
      parseInt(input.value, 10)
    );

    this.rangeProgress.style.left =
      ((minVal - this.minLimit) / (this.maxLimit - this.minLimit)) * 100 + "%";
    this.rangeProgress.style.right =
      100 -
      ((maxVal - this.minLimit) / (this.maxLimit - this.minLimit)) * 100 +
      "%";
  }

  public resetSelection(): void {
    this.rangeInputs.forEach((input, index) => {
      input.value =
        index === 0 ? this.minLimit.toString() : this.maxLimit.toString();
    });
    this.numberInputs.forEach((input, index) => {
      input.value =
        index === 0 ? this.minLimit.toString() : this.maxLimit.toString();
    });
    this.updateProgress();
  }

  public handleCurrencyChange = (): void => {
    if (!this.currencyConverter || !this.initMin || !this.initMax) return;
    const [symbol, convertedMin] = this.currencyConverter.convert(
      CurrencyEnum.USD,
      this.initMin
    );
    this.minLimit = Math.round(convertedMin);
    this.maxLimit = Math.round(
      this.currencyConverter.convert(CurrencyEnum.USD, this.initMax)[1]
    );
    this.selectedMin = Math.max(
      Math.floor(
        this.currencyConverter.convert(
          this.currentCurrency as CurrencyEnum,
          this.selectedMin
        )[1]
      ),
      this.minLimit
    );
    this.selectedMax = Math.min(
      Math.ceil(
        this.currencyConverter.convert(
          this.currentCurrency as CurrencyEnum,
          this.selectedMax
        )[1]
      ),
      this.maxLimit
    );
    (
      this.container.querySelector("[data-unit]") as HTMLSpanElement
    ).textContent = symbol;
    this.currentCurrency = this.currencyConverter.getCurrentCurrency();
    this.minGap = Math.round((this.maxLimit - this.minLimit) / 10);
    this.initialize();
  };
}

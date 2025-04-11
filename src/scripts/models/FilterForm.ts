import { RangeSlider } from "./RangeSlider";

export class FilterForm {
  private form: HTMLFormElement;
  private submitButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;
  private sliderElements: Record<string, RangeSlider> = {};
  private lastSubmittedValues: Record<string, (number | null)[] | string>;
  private currentValues: Record<string, (number | null)[] | string>;

  constructor(
    sliderRanges: Record<string, number[]>,
    initialValues: Record<string, (number | null)[] | string>,
    private onSubmit: (
      filters: Record<string, (number | null)[] | string>
    ) => void
  ) {
    this.form = document.querySelector("#filtersForm") as HTMLFormElement;
    this.submitButton = this.form.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;
    this.resetButton = this.form.querySelector(
      "button[type=reset]"
    ) as HTMLButtonElement;
    this.lastSubmittedValues = { ...initialValues };
    this.currentValues = { ...initialValues };
    this.setInitialValues(sliderRanges, initialValues);
    this.form.addEventListener("change", this.handleCheckboxChange);
    this.form.addEventListener("reset", this.handleReset);
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.lastSubmittedValues = { ...this.currentValues };
      this.onSubmit(this.currentValues);
      this.submitButton.disabled = true;
      this.form
        .querySelectorAll(".changed")
        .forEach((el) => el.classList.remove("changed"));
    });
  }

  private setInitialValues(
    sliderRanges: Record<string, number[]>,
    selectedValues: Record<string, (number | null)[] | string>
  ): void {
    for (const [key, [min, max]] of Object.entries(sliderRanges)) {
      this.sliderElements[key] = new RangeSlider(
        key,
        min,
        max,
        this.handleRangeChange,
        selectedValues[key] ? (selectedValues[key][0] as number) : null,
        selectedValues[key] ? (selectedValues[key][1] as number) : null
      );
    }

    if (selectedValues["propertyType"])
      (this.form.elements.namedItem("propertyType") as HTMLInputElement).value =
        selectedValues["propertyType"] as string;

    if (Object.keys(selectedValues).length) this.resetButton.disabled = false;
  }

  private handleCheckboxChange = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    if (target.type !== "radio") return;

    if (target.value === "All") {
      delete this.currentValues[target.name];
    } else {
      this.currentValues[target.name] = target.value;
    }

    const radioList = this.form.elements.namedItem(
      target.name
    ) as RadioNodeList;

    (radioList[0] as HTMLInputElement).classList.toggle(
      "changed",
      this.lastSubmittedValues[target.name]
        ? this.lastSubmittedValues[target.name] !== target.value
        : target.value !== "All"
    );

    this.checkSubmitState();
  };

  private handleRangeChange = (
    rangeName: string,
    min: number | null,
    max: number | null
  ): boolean[] => {
    if (!min && !max) {
      delete this.currentValues[rangeName];
    } else {
      this.currentValues[rangeName] = [min, max];
    }
    this.checkSubmitState();

    const submitedValues = this.lastSubmittedValues[rangeName];
    return submitedValues
      ? [min, max].map((val, i) => val !== submitedValues[i])
      : [min, max].map((val) => val !== null);
  };

  private handleReset = (e: Event): void => {
    e.preventDefault();
    this.onSubmit({});
    this.lastSubmittedValues = {};
    this.currentValues = {};
    this.submitButton.disabled = true;
    this.resetButton.disabled = true;
    this.form
      .querySelectorAll(".changed")
      .forEach((el) => el.classList.remove("changed"));
    (this.form.elements.namedItem("propertyType") as HTMLInputElement).value =
      "All";
    Object.values(this.sliderElements).forEach((slider) =>
      slider.resetSelection()
    );
  };

  private checkSubmitState(): void {
    if (
      Object.keys(this.currentValues).length !==
      Object.keys(this.lastSubmittedValues).length
    ) {
      this.submitButton.disabled = false;
      this.resetButton.disabled = Object.keys(this.currentValues).length === 0;
      return;
    }

    for (const [key, values] of Object.entries(this.currentValues)) {
      if (key in this.lastSubmittedValues) {
        if (typeof values === "string") {
          console.log(values, this.lastSubmittedValues[key]);
          if (values !== this.lastSubmittedValues[key]) {
            this.submitButton.disabled = false;
            this.resetButton.disabled =
              Object.keys(this.currentValues).length === 0;
            return;
          }
        } else if (
          values.some((val, i) => val !== this.lastSubmittedValues[key][i])
        ) {
          this.submitButton.disabled = false;
          this.resetButton.disabled =
            Object.keys(this.currentValues).length === 0;
          return;
        }
      } else {
        this.submitButton.disabled = false;
        this.resetButton.disabled =
          Object.keys(this.lastSubmittedValues).length === 0;
        return;
      }
    }

    for (const [key, values] of Object.entries(this.lastSubmittedValues)) {
      if (key in this.currentValues) {
        if (typeof values === "string") {
          if (values !== this.currentValues[key]) {
            this.submitButton.disabled = false;
            this.resetButton.disabled =
              Object.keys(this.currentValues).length === 0;
            return;
          }
        } else if (
          values.some((val, i) => val !== this.currentValues[key][i])
        ) {
          this.submitButton.disabled = false;
          this.resetButton.disabled =
            Object.keys(this.lastSubmittedValues).length === 0;
          return;
        }
      } else {
        this.submitButton.disabled = false;
        this.resetButton.disabled =
          Object.keys(this.lastSubmittedValues).length === 0;
        return;
      }
    }
    this.submitButton.disabled = true;
    this.resetButton.disabled = Object.keys(this.currentValues).length === 0;
  }
}

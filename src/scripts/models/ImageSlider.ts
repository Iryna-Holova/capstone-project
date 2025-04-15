export class ImageSlider {
  private dataImages: string[] = [
    "Villa",
    "House",
    "Apartment",
    "Studio",
    "Commercial",
  ];
  private container: HTMLElement;
  private slides: HTMLLIElement[];
  private currentSlide = 4;
  private autoplayInterval: number = 3000;
  private intervalId: number | null = null;
  constructor() {
    this.container = document.querySelector("#slider") as HTMLElement;
    this.slides = Array.from(this.container.querySelectorAll("li"));

    this.container
      .querySelector("#slider-controls")
      ?.childNodes.forEach((node) => {
        node.addEventListener("click", this.handleControls);
      });

    this.container
      .querySelector("#slider-links")
      ?.childNodes.forEach((node) =>
        node.addEventListener("click", this.handleNavigate)
      );

    this.container.addEventListener("mouseenter", this.pauseAutoplay);
    this.container.addEventListener("mouseleave", this.startAutoplay);
    setTimeout(
      () => this.slides[4].classList.remove("is-start"),
      this.autoplayInterval
    );
    this.startAutoplay();
  }

  private switchSlide(direction: number) {
    if (!this.slides[this.currentSlide].isConnected) {
      return this.clearAutoplay();
    }
    this.slides[this.currentSlide].classList.remove("is-active");
    this.currentSlide =
      (this.currentSlide + this.slides.length + direction) % this.slides.length;
    this.slides[this.currentSlide].classList.add("is-active");
  }

  private handleControls = (event: Event) => {
    const target = event.currentTarget as HTMLButtonElement;
    const { direction } = target.dataset;
    this.switchSlide(parseInt(direction as string, 10));
  };

  private startAutoplay = () => {
    this.clearAutoplay();

    this.intervalId = window.setInterval(() => {
      this.switchSlide(1);
    }, this.autoplayInterval);
  };

  private pauseAutoplay = () => {
    this.clearAutoplay();
  };

  private clearAutoplay = () => {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };

  private handleNavigate = (event: Event) => {
    const target = event.currentTarget as HTMLAnchorElement;
    const url = target.getAttribute("href");
    target.href = `${url}?propertyType=${this.dataImages[this.currentSlide]}`;
  };
}

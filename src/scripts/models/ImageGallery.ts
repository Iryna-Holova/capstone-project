export class ImageGallery {
  private container: HTMLDivElement;
  private imageList: HTMLUListElement;
  private listItems: HTMLLIElement[];
  private itemsCount: number;
  private counter: HTMLSpanElement;
  private shownImage = 0;
  private touchStartX = 0;
  private touchEndX = 0;

  constructor(private dataImages: string[], private dataTitle: string) {
    this.container = document.querySelector("#image-gallery") as HTMLDivElement;
    this.imageList = this.container.querySelector("ul") as HTMLUListElement;
    this.counter = this.container.querySelector("#counter") as HTMLSpanElement;

    this.itemsCount = this.dataImages.length;
    this.listItems = dataImages.map((_, index) => this.createItem(index));
    this.imageList.append(...this.listItems);
    this.counter.textContent = `1 / ${this.itemsCount}`;

    this.container.addEventListener("click", this.handleActions);
    if (this.itemsCount > 1) {
      this.container.addEventListener("touchstart", this.handleTouchStart);
      this.container.addEventListener("touchend", this.handleTouchEnd);
    } else {
      this.container
        .querySelectorAll("[data-action=switchImage]")
        .forEach((button) => ((button as HTMLButtonElement).disabled = true));
    }
  }

  private handleActions = (event: Event) => {
    const target = event.target as HTMLElement;
    const { action } = target.dataset;
    if (!action) return;

    switch (action) {
      case "openModal": {
        this.openModal();
        break;
      }
      case "closeModal": {
        this.closeModal();
        break;
      }
      case "switchImage": {
        const { direction } = target.dataset;
        if (!direction) return;
        this.switchImage(direction);
        break;
      }
      default:
        break;
    }
  };

  private switchImage = (direction: string) => {
    this.listItems[this.shownImage].classList.remove("visible");

    this.shownImage =
      (this.shownImage + this.itemsCount + Number(direction)) % this.itemsCount;

    this.listItems[this.shownImage].classList.add("visible");
    this.counter.textContent = `${this.shownImage + 1} / ${this.itemsCount}`;
  };

  private openModal = () => {
    this.container.dataset["open"] = "true";
    this.container.setAttribute("data-action", "closeModal");
    document.documentElement.classList.add("no-scroll");
    document.addEventListener("keydown", this.handleKeydown);
  };

  private closeModal = () => {
    this.container.dataset["open"] = "false";
    this.container.removeAttribute("data-action");
    document.documentElement.classList.remove("no-scroll");
    document.removeEventListener("keydown", this.handleKeydown);
  };

  private handleKeydown = (event: KeyboardEvent) => {
    const { key } = event;
    if (key === "Escape") this.closeModal();
    if (key === "ArrowLeft") this.switchImage("-1");
    if (key === "ArrowRight") this.switchImage("1");
  };

  private handleTouchStart = (event: TouchEvent) => {
    this.touchStartX = event.touches[0].clientX;
  };

  private handleTouchEnd = (event: TouchEvent) => {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  };

  private handleSwipe = () => {
    const swipeThreshold = 50;

    if (this.touchStartX - this.touchEndX > swipeThreshold) {
      this.switchImage("1");
    } else if (this.touchEndX - this.touchStartX > swipeThreshold) {
      this.switchImage("-1");
    }
  };

  private createItem = (index: number): HTMLLIElement => {
    const item = document.createElement("li");
    const img = document.createElement("img");
    img.alt = this.dataTitle;
    img.src = this.dataImages[index];
    img.loading = "lazy";
    item.appendChild(img);

    if (index === 0) {
      item.classList.add("visible");
    }

    return item;
  };
}

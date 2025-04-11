export class Header {
  private navBar = document.querySelector("#nav") as HTMLUListElement;
  private submenuButtons: HTMLButtonElement[] = Array.from(
    this.navBar.querySelectorAll("[data-open]")
  );
  private navLinks: HTMLAnchorElement[] = Array.from(
    this.navBar.querySelectorAll("nav a")
  );
  private burger = document.querySelector("#burger") as HTMLButtonElement;
  private backdrop = document.querySelector("#backdrop") as HTMLDivElement;
  private touchStartX = 0;
  private touchEndX = 0;
  constructor() {
    this.submenuButtons.forEach((button) => {
      button.addEventListener("click", this.handleSubmenu);
    });
    this.burger.addEventListener("click", this.handleBurger);
  }

  public highlightActiveLink(url: string): void {
    this.navLinks.forEach((link) => {
      link.classList.toggle("current", link.getAttribute("href") === url);
    });

    this.submenuButtons.forEach((button) => {
      button.classList.toggle(
        "current",
        url.startsWith(button.dataset["open"] as string)
      );
    });
  }

  private handleSubmenu = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement;
    if (button.classList.contains("is-open")) return;
    button.classList.add("is-open");

    const handleClose = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target === button.nextElementSibling) return;
      button.classList.remove("is-open");
      document.removeEventListener("click", handleClose);
    };
    setTimeout(() => {
      document.addEventListener("click", handleClose);
    });
  };

  private handleBurger = () => {
    if (this.burger.classList.contains("is-open")) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  };

  private openMenu = () => {
    this.burger.classList.add("is-open");
    this.navBar.classList.add("is-open");
    document.documentElement.classList.add("no-scroll");
    this.backdrop.classList.add("visible", "colored");
    this.backdrop.addEventListener("click", this.closeMenu);
    this.navLinks.forEach((link) => {
      link.addEventListener("click", this.closeMenu);
    });
    document.addEventListener("touchstart", this.handleTouchStart);
    document.addEventListener("touchend", this.handleTouchEnd);
  };

  private closeMenu = () => {
    this.burger.classList.remove("is-open");
    this.navBar.classList.remove("is-open");
    document.documentElement.classList.remove("no-scroll");
    this.backdrop.classList.remove("visible", "colored");
    this.backdrop.removeEventListener("click", this.closeMenu);
    this.navLinks.forEach((link) => {
      link.removeEventListener("click", this.closeMenu);
    });
    document.removeEventListener("touchstart", this.handleTouchStart);
    document.removeEventListener("touchend", this.handleTouchEnd);
    setTimeout(() => {
      this.navBar.scrollTo(0, 0);
    }, 500);
  };

  private handleTouchStart = (event: TouchEvent) => {
    this.touchStartX = event.touches[0].clientX;
  };

  private handleTouchEnd = (event: TouchEvent) => {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipeGesture();
  };

  private handleSwipeGesture = () => {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const swipeThreshold = 50;
    if (swipeDistance > swipeThreshold) {
      this.closeMenu();
    }
  };
}

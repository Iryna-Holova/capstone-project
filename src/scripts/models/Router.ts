import { Header } from "./Header";

export class Router {
  private header: Header;
  private contentContainer: HTMLElement;
  private routes: {
    path: RegExp;
    templateUrl: URL;
    getModule?: () => Promise<unknown>;
  }[];
  constructor(header: Header) {
    this.header = header;
    this.contentContainer = document.getElementById("content") as HTMLElement;
    this.routes = [
      {
        path: /^\/$/,
        templateUrl: new URL("../../templates/home.html", import.meta.url),
        getModule: () => import("../home"),
      },
      {
        path: /^\/gallery\/(buy|rent)$/,
        templateUrl: new URL("../../templates/gallery.html", import.meta.url),
        getModule: () => import("../gallery"),
      },
      {
        path: /^\/gallery\/(buy|rent)\/details\/[^/]+$/,
        templateUrl: new URL("../../templates/details.html", import.meta.url),
        getModule: () => import("../details"),
      },
      {
        path: /^\/contacts$/,
        templateUrl: new URL("../../templates/contacts.html", import.meta.url),
        getModule: () => import("../contacts"),
      },
    ];
    this.init();
  }

  private async loadTemplate(templateUrl: URL): Promise<string> {
    try {
      const res = await fetch(templateUrl);
      return await res.text();
    } catch (err) {
      console.error("Error loading template:", err);
      return "<h1>404 - Not Found</h1>";
    }
  }

  private insertTemplate = (content: string): void => {
    this.contentContainer.innerHTML = content;
    const event = new CustomEvent("templateRendered", {
      detail: { path: window.location.pathname },
    });
    document.dispatchEvent(event);
  };

  private async renderPage() {
    this.contentContainer.classList.add("is-loading");
    const path = window.location.pathname;
    const route = this.routes.find((r) => r.path.test(path));

    if (route) {
      await this.loadTemplate(route.templateUrl).then(this.insertTemplate);
      if (route.getModule) {
        try {
          const module = (await route.getModule()) as { init?: () => void };
          if (module.init) module.init();
        } catch (err) {
          console.error("Error loading the script:", err);
        }
      }
    } else {
      window.history.replaceState({ canGoBack: false }, "", "/");
      this.renderPage();
    }

    this.header.highlightActiveLink(path);
    this.contentContainer.classList.remove("is-loading");
  }

  private navigateTo(url: string): void {
    if (window.location.pathname !== url) {
      window.history.pushState({ canGoBack: true }, "", url);
      this.renderPage();
    }
  }

  private init() {
    window.history.replaceState({ canGoBack: false }, "");
    window.addEventListener("popstate", () => this.renderPage());
    document.addEventListener("click", (event: Event): void => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A" && target.hasAttribute("data-spa-link")) {
        event.preventDefault();
        if (
          target.hasAttribute("data-spa-back") &&
          window.history.state.canGoBack
        ) {
          window.history.back();
        } else {
          const url = target.getAttribute("href");
          if (url) this.navigateTo(url);
        }
        if (target.hasAttribute("data-spa-scroll")) {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }
    });
    this.renderPage();
  }
}

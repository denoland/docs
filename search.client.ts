import { defineCustomElements } from "@orama/wc-components/loader/index.js";
import { JSX as OramaJSX } from "@orama/wc-components/dist/types/index.d.ts";

document.addEventListener("DOMContentLoaded", () => {
  defineCustomElements();
  const oramaSearchBox: OramaJSX.OramaSearchBox | null = document.querySelector(
    "orama-search-box",
  );

  if (oramaSearchBox) {
    // Get current theme
    const currentTheme = localStorage.denoDocsTheme ||
      (globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    oramaSearchBox.colorScheme = currentTheme;

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement) {
          const isDark = mutation.target.classList.contains("dark");
          oramaSearchBox.colorScheme = isDark ? "dark" : "light";
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    oramaSearchBox.themeConfig = {
      colors: {
        light: {},
      },
    };
    oramaSearchBox.index = {
      api_key: "BhHQBNY6gwBukMREm9FOproywA50UDQs",
      endpoint: "https://cloud.orama.run/v1/indexes/deno-docs-pp7js4",
    };
    oramaSearchBox.resultMap = {
      description: "content",
      section: "section",
    };
    oramaSearchBox.facetProperty = "category";
    oramaSearchBox.highlight = { HTMLTag: "b" };
    oramaSearchBox.sourceBaseUrl = "https://docs.deno.com";
    oramaSearchBox.suggestions = [
      "How to get started?",
      "How to configure?",
      "How to deploy?",
    ];
  }

  const oramaSearchButton: OramaJSX.OramaSearchButton | null = document
    .querySelector("orama-search-button");

  if (oramaSearchButton) {
    // Get current theme
    const currentTheme = localStorage.denoDocsTheme ||
      (globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    oramaSearchButton.colorScheme = currentTheme;

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement) {
          const isDark = mutation.target.classList.contains("dark");
          oramaSearchButton.colorScheme = isDark ? "dark" : "light";
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    oramaSearchButton.themeConfig = {
      colors: {
        light: {},
      },
    };
    oramaSearchButton.innerText = "Search";
    oramaSearchButton.size = "small";
  }
});

declare module "npm:preact" {
  namespace JSX {
    interface IntrinsicElements {
      "orama-search-box": OramaJSX.OramaSearchBox;
      "orama-search-button": OramaJSX.OramaSearchButton;
    }
  }
}

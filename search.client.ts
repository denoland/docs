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
        light: {
          "--text-color-primary": "#1f2328",
          "--text-color-secondary": "#404040",
          "--text-color-accent": "#3680f6",
          "--text-color-inactive": "#737373",
          "--background-color-primary": "#ffffff",
          "--background-color-secondary": "#ffffff",
          "--background-color-tertiary": "#e7f1ff",
          "--border-color-primary": "#e6e6e6",
          "--border-color-secondary": "#ffffff",
          "--border-color-tertiary": "#e6e6e6",
          "--border-color-accent": "#e7f1ff",
          "--icon-color-accent": "#3680f6",
          "--button-text-color-primary": "#e7f1ff",
          "--button-background-color-primary": "#3680f6",
          "--button-background-color-secondary": "#ffffff",
          "--button-background-color-secondary-hover": "#e7f1ff",
          "--button-border-color-secondary": "#e6e6e6",
          "--chat-button-border-color-gradientOne": "#ffffff",
          "--chat-button-border-color-gradientTwo": "#ffffff",
          "--chat-button-border-color-gradientThree": "#ffffff",
          "--chat-button-border-color-gradientFour": "#3680f6",
          "--chat-button-border-color-gradientFive": "#ffffff",
          "--chat-button-border-color-gradientSix": "#ffffff",
          "--chat-button-background-color-gradientOne": "#3680f6",
        },
        dark: {
          "--text-color-primary": "#ffffff",
          "--text-color-secondary": "#ffffff",
          "--text-color-accent": "#00c2ff",
          "--text-color-inactive": "#737373",
          "--background-color-primary": "#0d1117",
          "--background-color-secondary": "#0d1117",
          "--background-color-tertiary": "#0d1117",
          "--border-color-primary": "#2b323c",
          "--border-color-secondary": "#2b323c",
          "--border-color-tertiary": "#2b323c",
          "--border-color-accent": "#3680f6",
          "--icon-color-accent": "#00c2ff",
          "--button-text-color-primary": "#ffffff",
          "--button-background-color-primary": "#3680f6",
          "--button-background-color-secondary": "#161d27",
          "--button-background-color-secondary-hover": "#2b323c",
          "--button-border-color-secondary": "#2b323c",
          "--chat-button-border-color-gradientOne": "#2b323c",
          "--chat-button-border-color-gradientTwo": "#2b323c",
          "--chat-button-border-color-gradientThree": "#3680f6",
          "--chat-button-border-color-gradientFour": "#3680f6",
          "--chat-button-border-color-gradientFive": "#2b323c",
          "--chat-button-border-color-gradientSix": "#2b323c",
          "--chat-button-background-color-gradientOne": "#3680f6",
        },
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
        light: {
          "--text-color-primary": "#1f2328",
          "--text-color-secondary": "#404040",
          "--text-color-accent": "#3680f6",
          "--text-color-inactive": "#737373",
          "--background-color-primary": "#ffffff",
          "--background-color-secondary": "#ffffff",
          "--background-color-tertiary": "#e7f1ff",
          "--border-color-primary": "#e6e6e6",
          "--border-color-secondary": "#ffffff",
          "--border-color-tertiary": "#e6e6e6",
          "--border-color-accent": "#e7f1ff",
          "--icon-color-accent": "#3680f6",
          "--button-text-color-primary": "#e7f1ff",
          "--button-background-color-primary": "#3680f6",
          "--button-background-color-secondary": "#ffffff",
          "--button-background-color-secondary-hover": "#e7f1ff",
          "--button-border-color-secondary": "#e6e6e6",
          "--chat-button-border-color-gradientOne": "#ffffff",
          "--chat-button-border-color-gradientTwo": "#ffffff",
          "--chat-button-border-color-gradientThree": "#ffffff",
          "--chat-button-border-color-gradientFour": "#3680f6",
          "--chat-button-border-color-gradientFive": "#ffffff",
          "--chat-button-border-color-gradientSix": "#ffffff",
          "--chat-button-background-color-gradientOne": "#3680f6",
        },
        dark: {
          "--text-color-primary": "#ffffff",
          "--text-color-secondary": "#ffffff",
          "--text-color-accent": "#00c2ff",
          "--text-color-inactive": "#737373",
          "--background-color-primary": "#0d1117",
          "--background-color-secondary": "#0d1117",
          "--background-color-tertiary": "#0d1117",
          "--border-color-primary": "#2b323c",
          "--border-color-secondary": "#2b323c",
          "--border-color-tertiary": "#2b323c",
          "--border-color-accent": "#3680f6",
          "--icon-color-accent": "#00c2ff",
          "--button-text-color-primary": "#ffffff",
          "--button-background-color-primary": "#3680f6",
          "--button-background-color-secondary": "#161d27",
          "--button-background-color-secondary-hover": "#2b323c",
          "--button-border-color-secondary": "#2b323c",
          "--chat-button-border-color-gradientOne": "#2b323c",
          "--chat-button-border-color-gradientTwo": "#2b323c",
          "--chat-button-border-color-gradientThree": "#3680f6",
          "--chat-button-border-color-gradientFour": "#3680f6",
          "--chat-button-border-color-gradientFive": "#2b323c",
          "--chat-button-border-color-gradientSix": "#2b323c",
          "--chat-button-background-color-gradientOne": "#3680f6",
        },
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

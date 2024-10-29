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
          "--text-color-primary": "hsl(var(--foreground-primary))",
          "--text-color-secondary": "hsl(var(--foreground-secondary))",
          "--text-color-accent": "hsl(var(--primary))",
          "--text-color-inactive": "hsl(var(--foreground-secondary))",
          "--background-color-primary": "#ffffff",
          "--background-color-secondary": "#ffffff",
          "--background-color-tertiary": "hsl(var(--background-tertiary))",
          "--border-color-primary": "hsl(var(--foreground-tertiary))",
          "--border-color-secondary": "#ffffff",
          "--border-color-tertiary": "hsl(var(--foreground-tertiary))",
          "--border-color-accent": "hsl(var(--background-tertiary))",
          "--icon-color-accent": "hsl(var(--primary))",
          "--button-text-color-primary": "hsl(var(--background-tertiary))",
          "--button-background-color-primary": "hsl(var(--primary))",
          "--button-background-color-secondary": "#ffffff",
          "--button-background-color-secondary-hover":
            "hsl(var(--background-tertiary))",
          "--button-border-color-secondary": "hsl(var(--foreground-tertiary))",
          "--chat-button-border-color-gradientOne": "#ffffff",
          "--chat-button-border-color-gradientTwo": "#ffffff",
          "--chat-button-border-color-gradientThree": "#ffffff",
          "--chat-button-border-color-gradientFour": "hsl(var(--primary))",
          "--chat-button-border-color-gradientFive": "#ffffff",
          "--chat-button-border-color-gradientSix": "#ffffff",
          "--chat-button-background-color-gradientOne": "hsl(var(--primary))",
        },
        dark: {
          "--text-color-primary": "hsl(var(--foreground-primary))",
          "--text-color-secondary": "hsl(var(--foreground-primary))",
          "--text-color-accent": "hsl(var(--primary))",
          "--text-color-inactive": "hsl(var(--foreground-secondary))",
          "--background-color-primary": "hsl(var(--background-primary))",
          "--background-color-secondary": "hsl(var(--background-primary))",
          "--background-color-tertiary": "hsl(var(--background-primary))",
          "--border-color-primary": "hsl(var(--background-tertiary))",
          "--border-color-secondary": "hsl(var(--background-tertiary))",
          "--border-color-tertiary": "hsl(var(--background-tertiary))",
          "--border-color-accent": "hsl(var(--primary))",
          "--icon-color-accent": "hsl(var(--primary))",
          "--button-text-color-primary": "hsl(var(--foreground-primary))",
          "--button-background-color-primary": "hsl(var(--primary))",
          "--button-background-color-secondary":
            "hsl(var(--background-secondary))",
          "--button-background-color-secondary-hover":
            "hsl(var(--background-tertiary))",
          "--button-border-color-secondary": "hsl(var(--background-tertiary))",
          "--chat-button-border-color-gradientOne":
            "hsl(var(--background-tertiary))",
          "--chat-button-border-color-gradientTwo":
            "hsl(var(--background-tertiary))",
          "--chat-button-border-color-gradientThree": "hsl(var(--primary))",
          "--chat-button-border-color-gradientFour": "hsl(var(--primary))",
          "--chat-button-border-color-gradientFive":
            "hsl(var(--background-tertiary))",
          "--chat-button-border-color-gradientSix":
            "hsl(var(--background-tertiary))",
          "--chat-button-background-color-gradientOne": "hsl(var(--primary))",
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
          "--text-color-primary": "hsl(var(--foreground-primary))",
          "--text-color-secondary": "hsl(var(--foreground-secondary))",
          "--text-color-accent": "hsl(var(--primary))",
          "--text-color-inactive": "hsl(var(--foreground-secondary))",
          "--background-color-primary": "#ffffff",
          "--background-color-secondary": "#ffffff",
          "--background-color-tertiary": "hsl(var(--background-tertiary))",
          "--border-color-primary": "hsl(var(--foreground-tertiary))",
          "--border-color-secondary": "#ffffff",
          "--border-color-tertiary": "hsl(var(--foreground-tertiary))",
          "--border-color-accent": "hsl(var(--background-tertiary))",
          "--icon-color-accent": "hsl(var(--primary))",
          "--button-text-color-primary": "hsl(var(--background-tertiary))",
          "--button-background-color-primary": "hsl(var(--primary))",
          "--button-background-color-secondary": "#ffffff",
          "--button-background-color-secondary-hover":
            "hsl(var(--background-tertiary))",
          "--button-border-color-secondary": "hsl(var(--foreground-tertiary))",
          "--chat-button-border-color-gradientOne": "#ffffff",
          "--chat-button-border-color-gradientTwo": "#ffffff",
          "--chat-button-border-color-gradientThree": "#ffffff",
          "--chat-button-border-color-gradientFour": "hsl(var(--primary))",
          "--chat-button-border-color-gradientFive": "#ffffff",
          "--chat-button-border-color-gradientSix": "#ffffff",
          "--chat-button-background-color-gradientOne": "hsl(var(--primary))",
        },
        dark: {
          "--text-color-primary": "hsl(var(--foreground-primary))",
          "--text-color-secondary": "hsl(var(--foreground-primary))",
          "--text-color-accent": "hsl(var(--primary))",
          "--text-color-inactive": "hsl(var(--foreground-secondary))",
          "--background-color-primary": "hsl(var(--background-primary))",
          "--background-color-secondary": "hsl(var(--background-primary))",
          "--background-color-tertiary": "hsl(var(--background-primary))",
          "--border-color-primary": "hsl(var(--background-tertiary))",
          "--border-color-secondary": "hsl(var(--background-tertiary))",
          "--border-color-tertiary": "hsl(var(--background-tertiary))",
          "--border-color-accent": "hsl(var(--primary))",
          "--icon-color-accent": "hsl(var(--primary))",
          "--button-text-color-primary": "hsl(var(--foreground-primary))",
          "--button-background-color-primary": "hsl(var(--primary))",
          "--button-background-color-secondary":
            "hsl(var(--background-secondary))",
          "--button-background-color-secondary-hover":
            "hsl(var(--background-tertiary))",
          "--button-border-color-secondary": "hsl(var(--background-tertiary))",
          "--chat-button-border-color-gradientOne":
            "hsl(var(--background-tertiary))",
          "--chat-button-border-color-gradientTwo":
            "hsl(var(--background-tertiary))",
          "--chat-button-border-color-gradientThree": "hsl(var(--primary))",
          "--chat-button-border-color-gradientFour": "hsl(var(--primary))",
          "--chat-button-border-color-gradientFive":
            "hsl(var(--background-tertiary))",
          "--chat-button-border-color-gradientSix":
            "hsl(var(--background-tertiary))",
          "--chat-button-background-color-gradientOne": "hsl(var(--primary))",
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

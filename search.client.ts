import { defineCustomElements } from "@orama/wc-components/loader/index.js";
import { JSX as OramaJSX } from "@orama/wc-components/dist/types/index.d.ts";

document.addEventListener("DOMContentLoaded", () => {
  defineCustomElements();
  const oramaSearchBox: OramaJSX.OramaSearchBox | null = document.querySelector(
    "orama-search-box",
  );

  if (oramaSearchBox) {
    oramaSearchBox.colorScheme = "light";
    oramaSearchBox.themeConfig = {
      colors: {
        light: {
          "--button-text-color-primary": "#0B0D11",
          "--button-background-color-primary": "#32f59a",
          "--button-background-color-secondary-hover": "#d6ffe1",
          "--background-color-tertiary": "#f0fff1",
          "--border-color-accent": "#09dc8b",
          "--chat-button-background-color-gradientOne": "#31F69A",
          "--chat-button-background-color-gradientTwo": "#d6ffe1",
          "--text-color-accent": "#01b780",

          "--chat-button-border-color-gradientOne": "#d6ffe1",
          "--chat-button-border-color-gradientTwo": "#d6ffe1",
          "--chat-button-border-color-gradientThree": "#09dc8b",
          "--chat-button-border-color-gradientFour": "#09dc8b",
          "--chat-button-border-color-gradientFive": "#d6ffe1",
          "--chat-button-border-color-gradientSix": "#d6ffe1",
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
    oramaSearchButton.colorScheme = "light";
    oramaSearchButton.themeConfig = {
      colors: {
        light: {
          "--button-background-color-secondary-hover": "#f6f7f9",
          "--background-color-tertiary": "#f0fff1",
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

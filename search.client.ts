// deno-lint-ignore-file no-explicit-any
import "@orama/wc-components/dist/esm/orama-ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const oramaSearchBox: any = document.querySelector(
    "orama-search-box",
  );

  if (oramaSearchBox) {
    oramaSearchBox.index = {
      api_key: "BhHQBNY6gwBukMREm9FOproywA50UDQs",
      endpoint: "https://cloud.orama.run/v1/indexes/deno-docs-pp7js4",
    };
    oramaSearchBox.colorScheme = "light";
    oramaSearchBox.resultMap = {
      description: "content",
      section: "section",
    };
    oramaSearchBox.facetProperty = "category";
  }

  const oramaSearchButton = document
    .querySelector(
      "orama-search-button",
    ) as any;
  if (oramaSearchButton) {
    oramaSearchButton.innerText = "Search";
    oramaSearchButton.size = "small";
    oramaSearchButton.colorScheme = "light";
  }
});

declare module "npm:preact" {
  namespace JSX {
    interface IntrinsicElements {
      "orama-search-box": unknown;
      "orama-search-button": unknown;
    }
  }
}

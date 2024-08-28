// deno-lint-ignore-file no-explicit-any
document.addEventListener("DOMContentLoaded", () => {
  const oramaSearchBox = document.querySelector("orama-search-box") as any;
  if (oramaSearchBox) {
    oramaSearchBox.index = {
      api_key: "BhHQBNY6gwBukMREm9FOproywA50UDQs",
      endpoint: "https://cloud.orama.run/v1/indexes/deno-docs-pp7js4",
    };
    oramaSearchBox.colorScheme = "light";
    oramaSearchBox.resultMap = {
      description: "content",
    };
    oramaSearchBox.facetProperty = "category";
  }

  const oramaSearchButton = document.querySelector(
    "orama-search-button",
  ) as any;
  if (oramaSearchButton) {
    oramaSearchButton.innerText = "Search";
    oramaSearchBox.colorScheme = "light";
  }
});

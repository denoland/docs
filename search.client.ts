import { OramaClient } from "npm:@oramacloud/client@1";

const client = new OramaClient({
  endpoint: "https://cloud.orama.run/v1/indexes/docs-g5yhsx",
  api_key: "Pq00jdTl6aPhxkGoctBHDRlxHdobJHUF",
});

document.addEventListener("DOMContentLoaded", () => {
  oramaSearchbox.RegisterSearchBox({
    oramaInstance: client,
    colorScheme: "light",
    resultsMap: {
      description: "content",
    },
    facetProperty: "category",
  });
  oramaSearchbox.RegisterSearchButton({
    colorScheme: "light",
    themeConfig: {
      light: {
        "--search-btn-background-color": "#fff",
        "--search-btn-border-color": "rgb(229 231 235)",
      },
    },
  });
});

declare global {
  const oramaSearchbox: {
    RegisterSearchBox: (options: {
      oramaInstance: OramaClient;
      colorScheme: "light" | "dark";
      resultsMap: Record<string, string>;
    }) => void;
    RegisterSearchButton: (
      options: {
        colorScheme: "light" | "dark";
        themeConfig: { light: Record<string, string> };
      },
    ) => void;
  };
}

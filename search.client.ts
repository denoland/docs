import { OramaClient } from "npm:@oramacloud/client@1";

const client = new OramaClient({
  endpoint: "https://cloud.orama.run/v1/indexes/deno-docs-pp7js4",
  api_key: "BhHQBNY6gwBukMREm9FOproywA50UDQs",
});

document.addEventListener("DOMContentLoaded", () => {
  oramaSearchbox.RegisterSearchBox({
    oramaInstance: client,
    colorScheme: "light",
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
    }) => void;
    RegisterSearchButton: (
      options: {
        colorScheme: "light" | "dark";
        themeConfig: { light: Record<string, string> };
      },
    ) => void;
  };
}

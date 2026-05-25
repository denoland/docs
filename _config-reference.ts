/**
 * Minimal Lume config for building only the API reference pages.
 * Run in parallel with the main build to speed up CI.
 *
 * Usage: deno run --env-file -P=lume lume/cli.ts --config=_config-reference.ts
 */
import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";

import denoCategories from "./reference_gen/deno-categories.json" with {
  type: "json",
};
import webCategories from "./reference_gen/web-categories.json" with {
  type: "json",
};
import nodeRewriteMap from "./reference_gen/node-rewrite-map.json" with {
  type: "json",
};

const nodeCategories = Object.keys(nodeRewriteMap);

const site = lume({
  location: new URL("https://docs.deno.com"),
  caseSensitiveUrls: true,
  emptyDest: false,
});

// Only need JSX for rendering reference components
site.use(jsx());

// Ignore everything except the reference page generator and its dependencies
site.ignore(
  "old",
  "README.md",
  "runtime",
  "deploy",
  "examples",
  "sandbox",
  "subhosting",
  "lint",
  "api",
  "styleguide",
  "middleware",
  "js",
  "style.css",
  "static",
  "open_graph",
  "orama",
  "scripts",
  (path) => path.match(/\/reference_gen.*.ts/) !== null,
  (path) => path.includes("/reference_gen/node_modules"),
  (path) => path.includes("/reference_gen/node_descriptions"),
);

// Copy reference CSS/JS assets
site.copy("reference_gen/gen/deno/page.css", "/api/deno/page.css");
site.copy("reference_gen/gen/deno/styles.css", "/api/deno/styles.css");
site.copy("reference_gen/gen/deno/script.js", "/api/deno/script.js");

site.copy("reference_gen/gen/web/page.css", "/api/web/page.css");
site.copy("reference_gen/gen/web/styles.css", "/api/web/styles.css");
site.copy("reference_gen/gen/web/script.js", "/api/web/script.js");

site.copy("reference_gen/gen/node/page.css", "/api/node/page.css");
site.copy("reference_gen/gen/node/styles.css", "/api/node/styles.css");
site.copy("reference_gen/gen/node/script.js", "/api/node/script.js");

site.data("layout", "doc.tsx");

site.data("apiCategories", {
  deno: {
    title: "Deno APIs",
    categories: Object.keys(denoCategories),
    descriptions: denoCategories,
    getCategoryHref: (categoryName: string) => {
      if (categoryName === "I/O") {
        return `/api/deno/io`;
      }
      return `/api/deno/${categoryName.toLowerCase().replace(/\s+/g, "-")}`;
    },
  },
  web: {
    title: "Web APIs",
    categories: Object.keys(webCategories),
    descriptions: webCategories,
    getCategoryHref: (categoryName: string) => {
      if (categoryName === "I/O") {
        return `/api/web/io`;
      }
      return `/api/web/${categoryName.toLowerCase().replace(/\s+/g, "-")}`;
    },
  },
  node: {
    title: "Node APIs",
    categories: nodeCategories,
    descriptions: {} as Record<string, string>,
    getCategoryHref: (categoryName: string) => `/api/node/${categoryName}/`,
  },
});

export default site;

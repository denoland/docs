import "@std/dotenv/load";

import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import prism from "lume/plugins/prism.ts";
import redirects from "lume/plugins/redirects.ts";
import search from "lume/plugins/search.ts";
import sitemap from "lume/plugins/sitemap.ts";
import postcss from "lume/plugins/postcss.ts";
import checkUrls from "lume/plugins/check_urls.ts";

import tw from "tailwindcss";
import tailwindConfig from "./tailwind.config.js";

import Prism from "./prism.ts";

import title from "https://deno.land/x/lume_markdown_plugins@v0.7.0/title.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import { CSS as GFM_CSS } from "https://jsr.io/@deno/gfm/0.8.2/style.ts";
import anchor from "npm:markdown-it-anchor@9";
import { full as emoji } from "npm:markdown-it-emoji@3";
import admonitionPlugin from "./markdown-it/admonition.ts";
import codeblockCopyPlugin from "./markdown-it/codeblock-copy.ts";
import codeblockTitlePlugin from "./markdown-it/codeblock-title.ts";
import relativeLinksPlugin from "./markdown-it/relative-path.ts";
import replacerPlugin from "./markdown-it/replacer.ts";
import {
  clear as oramaClear,
  deploy as oramaDeploy,
  generateDocumentsForExamples,
  generateDocumentsForPage,
  generateDocumentsForSymbols,
  notify as oramaNotify,
  OramaDocument,
} from "./orama.ts";

import apiDocumentContentTypeMiddleware from "./middleware/apiDocContentType.ts";
import redirectsMiddleware, {
  toFileAndInMemory,
} from "./middleware/redirects.ts";
import createRoutingMiddleware from "./middleware/functionRoutes.ts";
import createGAMiddleware from "./middleware/googleAnalytics.ts";

const site = lume(
  {
    location: new URL("https://docs.deno.com"),
    caseSensitiveUrls: true,
    server: {
      middlewares: [
        redirectsMiddleware,
        createRoutingMiddleware(),
        createGAMiddleware({
          addr: { transport: "tcp", hostname: "localhost", port: 3000 },
        }),
        apiDocumentContentTypeMiddleware,
      ],
    },
  },
  {
    markdown: {
      plugins: [
        replacerPlugin,
        emoji,
        admonitionPlugin,
        codeblockCopyPlugin,
        codeblockTitlePlugin,
        [
          anchor,
          {
            permalink: anchor.permalink.linkInsideHeader({
              symbol:
                `<span class="sr-only">Jump to heading</span><span aria-hidden="true" class="anchor-end">#</span>`,
              placement: "after",
            }),
            getTokensText(tokens: { type: string; content: string }[]) {
              return tokens
                .filter((t) => ["text", "code_inline"].includes(t.type))
                .map((t) => t.content.replaceAll(/ \([0-9/]+?\)/g, ""))
                .join("")
                .trim();
            },
          },
        ],
        relativeLinksPlugin,
      ],
      options: {
        linkify: true,
        langPrefix: "highlight notranslate language-",
      },
    },
  },
);

site.copy("static", ".");
site.copy("subhosting/api/images");
site.copy("deploy/docs-images");
site.copy("deploy/kv/manual/images");
site.copy("deploy/tutorials/images");
site.copy("deploy/kv/tutorials/images");
site.copy("runtime/fundamentals/images");
site.copy("runtime/getting_started/images");
site.copy("runtime/reference/images");
site.copy("runtime/contributing/images");
site.copy("runtime/tutorials/images");
site.copy("deploy/manual/images");
site.copy("deno.json");
site.copy("go.json");
site.copy("oldurls.json");
site.copy("server.ts");
site.copy("middleware");
site.copy("examples");
site.copy(".env");

site.use(
  redirects({
    output: toFileAndInMemory,
  }),
);
site.use(search());
site.use(jsx());

site.use(
  postcss({
    plugins: [tw(tailwindConfig)],
  }),
);
site.use(
  esbuild({
    extensions: [".client.ts"],
    options: {
      minify: false,
      splitting: true,
    },
  }),
);

// This is a work-around due to deno-dom's dependency of nwsapi not supporting
// :has selectors, nor having intention of supporting them, so using `body:not(:has(.ddoc))`
// is not possible. This works around by adding an `apply-prism` class on pages that
// don't use a ddoc class.
site.process([".html"], (pages) => {
  for (const page of pages) {
    const document = page.document!;
    if (!document.querySelector(".ddoc")) {
      document.body.classList.add("apply-prism");
      document.querySelectorAll("body.apply-prism pre code").forEach((
        element,
      ) => Prism.highlightElement(element));
    }
  }
});

site.use(toc({ anchor: false }));
site.use(title());
site.use(sitemap());

site.addEventListener("afterBuild", () => {
  Deno.writeTextFileSync(site.dest("gfm.css"), GFM_CSS);
});

site.copy("reference_gen/gen/deno/page.css", "/api/deno/page.css");
site.copy("reference_gen/gen/deno/styles.css", "/api/deno/styles.css");
site.copy("reference_gen/gen/deno/script.js", "/api/deno/script.js");

site.copy("reference_gen/gen/web/page.css", "/api/web/page.css");
site.copy("reference_gen/gen/web/styles.css", "/api/web/styles.css");
site.copy("reference_gen/gen/web/script.js", "/api/web/script.js");

site.copy("reference_gen/gen/node/page.css", "/api/node/page.css");
site.copy("reference_gen/gen/node/styles.css", "/api/node/styles.css");
site.copy("reference_gen/gen/node/script.js", "/api/node/script.js");

site.process([".html"], (pages) => {
  for (const page of pages) {
    const document = page.document;
    if (document) {
      const tabGroups = document.querySelectorAll("deno-tabs");
      for (const tabGroup of tabGroups) {
        const newGroup = document.createElement("div");
        newGroup.classList.add("deno-tabs");
        newGroup.dataset.id = tabGroup.getAttribute("group-id")!;
        const buttons = document.createElement("ul");
        buttons.classList.add("deno-tabs-buttons");
        newGroup.appendChild(buttons);
        const tabs = document.createElement("div");
        tabs.classList.add("deno-tabs-content");
        newGroup.appendChild(tabs);
        for (const tab of tabGroup.children) {
          if (tab.tagName === "DENO-TAB") {
            const selected = tab.getAttribute("default") !== null;
            const buttonContainer = document.createElement("li");
            buttons.appendChild(buttonContainer);
            const button = document.createElement("button");
            button.textContent = tab.getAttribute("label")!;
            button.dataset.tab = tab.getAttribute("value")!;
            button.dataset.active = String(selected);
            buttonContainer.appendChild(button);
            const content = document.createElement("div");
            content.innerHTML = tab.innerHTML;
            content.dataset.tab = tab.getAttribute("value")!;
            content.dataset.active = String(selected);
            tabs.appendChild(content);
          }
        }
        tabGroup.replaceWith(newGroup);
      }
    }
  }
});

const ORAMA_API_KEY = Deno.env.get("ORAMA_CLOUD_API_KEY");
const ORAMA_INDEX_ID = Deno.env.get("ORAMA_CLOUD_INDEX_ID");
if (ORAMA_API_KEY && ORAMA_INDEX_ID) {
  site.process([".html"], async (pages) => {
    let pageEntries: OramaDocument[] = [];

    await oramaClear(ORAMA_API_KEY, ORAMA_INDEX_ID);

    for (const page of pages) {
      if (
        page.document &&
        (page.data.url.startsWith("/runtime/") ||
          page.data.url.startsWith("/deploy/") ||
          page.data.url.startsWith("/subhosting/"))
      ) {
        pageEntries = pageEntries.concat(generateDocumentsForPage(page));
      }
    }

    await oramaNotify(ORAMA_API_KEY, ORAMA_INDEX_ID, pageEntries, "pages");

    await oramaNotify(
      ORAMA_API_KEY,
      ORAMA_INDEX_ID,
      await generateDocumentsForExamples(),
      "examples",
    );

    try {
      await oramaNotify(
        ORAMA_API_KEY,
        ORAMA_INDEX_ID,
        await generateDocumentsForSymbols(),
        "symbols",
      );
    } catch (e) {
      console.warn(
        "⚠️ Orama documents for reference docs were not generated.",
        e,
      );
    }

    await oramaDeploy(ORAMA_API_KEY, ORAMA_INDEX_ID);
  });
} else {
  console.warn("⚠️ Orama documents were not generated.");
}

site.ignore(
  "old",
  "README.md",
  (path) => path.match(/\/reference_gen.*.ts/) !== null,
  (path) => path.includes("/reference_gen/node_modules"),
  (path) => path.includes("/reference_gen/node_descriptions"),
  "examples",
  // "deploy",
  // "examples.page.tsx",
  // "runtime",
  // "subhosting",
);

site.scopedUpdates((path) => path == "/overrides.css");
site.use(checkUrls({
  external: false, // Set to true to check external links
  output: "_broken_links.json",
  ignore: [
    "https://www.googletagmanager.com",
  ],
}));

site.remoteFile(
  "orama.css",
  "https://unpkg.com/@orama/wc-components@0.1.7/dist/orama-ui/orama-ui.css",
);
site.copy("orama.css");
export default site;

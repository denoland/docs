import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import prism from "lume/plugins/prism.ts";
import search from "lume/plugins/search.ts";
import esbuild from "lume/plugins/esbuild.ts";
import redirects from "lume/plugins/redirects.ts";
import sitemap from "lume/plugins/sitemap.ts";

import tailwindConfig from "./tailwind.config.js";

import "npm:prismjs@1.29.0/components/prism-typescript.js";

import { full as emoji } from "npm:markdown-it-emoji@3";
import anchor from "npm:markdown-it-anchor@9";
import relativeLinksPlugin from "./markdown-it/relative-path.ts";
import replacerPlugin from "./markdown-it/replacer.ts";
import admonitionPlugin from "./markdown-it/admonition.ts";
import codeblockCopyPlugin from "./markdown-it/codeblock-copy.ts";
import codeblockTitlePlugin from "./markdown-it/codeblock-title.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import title from "https://deno.land/x/lume_markdown_plugins@v0.7.0/title.ts";
import { CSS as GFM_CSS } from "https://jsr.io/@deno/gfm/0.8.2/style.ts";
import {
  deploy as oramaDeploy,
  generateDocumentsForExamples,
  generateDocumentsForPage,
  generateDocumentsForSymbols,
  OramaDocument,
} from "./orama.ts";

const site = lume({
  location: new URL("https://docs.deno.com"),
  caseSensitiveUrls: true,
}, {
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
        },
      ],
      relativeLinksPlugin,
    ],
    options: {
      linkify: true,
      langPrefix: "highlight notranslate language-",
    },
  },
});

site.copy("static", ".");
site.copy("subhosting/api/images");
site.copy("deploy/docs-images");
site.copy("runtime/manual/images");
site.copy("deno.json");
site.copy("server.ts");

site.use(redirects({
  output: "json",
}));
site.use(search());
site.use(jsx());
site.use(tailwindcss({
  options: tailwindConfig,
  extensions: [".tsx", ".md", ".ts"],
}));
site.use(postcss());
site.use(esbuild({
  extensions: [".client.ts"],
  options: {
    minify: false,
  },
}));

// This is a work-around due to deno-dom's dependency of nwsapi not supporting
// :has selectors, nor having intention of supporting them, so using `body:not(:has(.ddoc))`
// is not possible. This works around by adding an `apply-prism` class on pages that
// don't use a ddoc class.
site.process([".html"], (pages) => {
  for (const page of pages) {
    const document = page.document;
    if (!document.querySelector(".ddoc")) {
      document.body.classList.add("apply-prism");
    }
  }
});
site.use(prism({
  cssSelector: "body.apply-prism pre code",
}));

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
site.copy("orama-searchbox-1.0.0-rc47.js");

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
    let searchEntries: OramaDocument[] = [];

    for (const page of pages) {
      if (
        page.document &&
        (page.data.url.startsWith("/runtime/") ||
          page.data.url.startsWith("/deploy/") ||
          page.data.url.startsWith("/subhosting/"))
      ) {
        searchEntries = searchEntries.concat(generateDocumentsForPage(page));
      }
    }

    searchEntries = searchEntries.concat(await generateDocumentsForExamples());

    try {
      searchEntries = searchEntries.concat(await generateDocumentsForSymbols());
    } catch (e) {
      console.warn(
        "⚠️ Orama documents for reference docs were not generated.",
        e,
      );
    }

    await oramaDeploy(ORAMA_API_KEY, ORAMA_INDEX_ID, searchEntries);
  });
} else {
  console.warn("⚠️ Orama documents were not generated.");
}

site.ignore(
  "old",
  "README.md",
  (path) => path.match(/\/reference_gen.*.ts/) !== null,
  (path) => path.includes("/reference_gen/node_modules"),
  "by-example",
  // "deploy",
  // "examples.page.tsx",
  // "runtime",
  // "subhosting",
);

site.remoteFile(
  "orama-searchbox-1.0.0-rc47.js",
  "https://unpkg.com/@orama/searchbox@1.0.0-rc47/dist/bundle.js",
);

site.scopedUpdates((path) => path == "/overrides.css");

export default site;

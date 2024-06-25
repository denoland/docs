import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import prism from "lume/plugins/prism.ts";
import search from "lume/plugins/search.ts";
import esbuild from "lume/plugins/esbuild.ts";

import tailwindConfig from "./tailwind.config.js";

import "npm:prismjs@1.29.0/components/prism-typescript.js";
import { full as emoji } from "npm:markdown-it-emoji@3";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import title from "https://deno.land/x/lume_markdown_plugins@v0.7.0/title.ts";
import anchor from "npm:markdown-it-anchor@9";

import { CSS as GFM_CSS } from "https://jsr.io/@deno/gfm/0.8.2/style.ts";

const site = lume({}, {
  markdown: {
    plugins: [
      emoji,
      [anchor, {
        permalink: anchor.permalink.linkInsideHeader({
          symbol:
            `<span class="sr-only">Jump to heading</span><span aria-hidden="true" class="anchor-end">#</span>`,
          placement: "after",
        }),
      }],
    ],
    options: {
      langPrefix: "highlight notranslate language-",
    },
  },
});

site.ignore("./old");
site.copy("static", ".");

site.use(search());
site.use(jsx());
site.use(tailwindcss({
  options: tailwindConfig,
  extensions: [".tsx", ".md", ".ts"],
}));
site.use(postcss());
site.use(esbuild({
  extensions: [".client.ts"],
}));
site.use(prism());
site.use(toc({ anchor: false }));
site.use(title());

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

export default site;

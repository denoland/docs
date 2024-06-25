import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import mdx from "lume/plugins/mdx.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";

import tailwindConfig from "./tailwind.config.js";
import search from "lume/plugins/search.ts";
import esbuild from "lume/plugins/esbuild.ts";

const site = lume();

site.ignore("./old");
site.copy("static", ".");

site.use(search());
site.use(jsx());
site.use(mdx({}));
site.use(
  tailwindcss({ options: tailwindConfig, extensions: [".tsx", ".mdx"] }),
);
site.use(postcss());
site.use(esbuild({
  extensions: [".client.ts"],
}));

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

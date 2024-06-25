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

export default site;

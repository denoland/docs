import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import esbuild from "lume/plugins/esbuild.ts";
import postcss from "lume/plugins/postcss.ts";
import tw from "tailwindcss";
import tailwindConfig from "./tailwind.config.js";

const site = lume({
  src: "./",
  dest: "./_site",
  emptyDest: false,
});

site.use(jsx());

// Use the base layout for all pages unless otherwise specified
site.data("layout", "base.tsx");

site.use(
  postcss({
    plugins: [tw(tailwindConfig)],
  }),
);

site.use(
  esbuild({
    extensions: [".client.ts", ".client.js"],
    options: {
      minify: false,
      format: "esm",
      splitting: true,
      bundle: true,
      platform: "browser",
      target: "esnext",
    },
  }),
);

// Ignore all folders that are not "styleguide"
// but honor edits to layouts and components etc
site.ignore((path) => {
  return path.match(/^\/styleguide/) === null;
});

// Copy static files to output directory
site.copy("styleguide/_static/", ".");

export default site;

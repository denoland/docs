import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import postcss from "lume/plugins/postcss.ts";

const site = lume({
  src: "./",
  dest: "./_site",
  emptyDest: false,
});

site.use(jsx());
site.use(postcss());

// Use the base layout for all pages unless otherwise specified
site.data("layout", "base.tsx");

// Ignore all folders that are not "styleguide"
// but honor edits to layouts and components etc
site.ignore((path) => {
  return path.match(/^\/styleguide/) === null;
});

// Copy static files to output directory
site.copy("styleguide/_static/", ".");

export default site;

import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";

const site = lume({
  src: ".",
  dest: "./_site",
  emptyDest: false,
});

site.use(jsx());

// Use the base layout for all pages unless otherwise specified
site.data("layout", "base.tsx");

// Ignore all folders that are not "styleguide"
// but honor edits to layouts and components etc
site.ignore((path) => {
  return path.match(/^\/styleguide/) === null;
});

export default site;

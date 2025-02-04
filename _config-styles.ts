import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import postcss from "lume/plugins/postcss.ts";
import tw from "tailwindcss";
import tailwindConfig from "./tailwind.config.js";


const site = lume({
  src: ".",
  dest: "./_site",
  emptyDest: false,
});



site.use(jsx());

// Use the base layout for all pages unless otherwise specified
site.data("layout", "base.tsx");

site.copy("style.css");

site.use(
  postcss({
    plugins: [tw(tailwindConfig)],
  }),
);

// Ignore all folders that are not "styleguide"
// but honor edits to layouts and components etc
site.ignore((path) => {
  return path.match(/^\/styleguide/) === null;
});

export default site;

import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";

const site = lume({
  src: ".",
  dest: "./_site",
  emptyDest: false,
});

site.use(jsx());

site.data("layout", "base.tsx");

// Ignore all fodlers that are not "styleguide"
site.ignore("deploy");
site.ignore("examples");
site.ignore("lint");
site.ignore("markdown-it");
site.ignore("middleware");
site.ignore("reference");
site.ignore("reference_gen");
site.ignore("runtime");
site.ignore("subhosting");
site.ignore("README.md");
site.ignore("404.tsx");
site.ignore("index.page.tsx");
export default site;

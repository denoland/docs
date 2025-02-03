import lume from "lume/mod.ts";

const site = lume({
  src: ".",
  dest: "./_site",
  emptyDest: false,
});

// site.data("layout", "base.vto");

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

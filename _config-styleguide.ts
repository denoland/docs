// Further refine the global Lume config for this section of the site
import ogImages from "lume/plugins/og_images.ts";
import site from "./_config.ts";

// Ignore everything not in the styleguide folder
site.ignore((path) => {
  return path.match(/^\/styleguide.*$/) === null;
});

site.data("openGraphLayout", "/open_graph/default.jsx");
site.data("openGraphLayout", "/examples", "/open_graph/examples.jsx");
// site.data("openGraphColor", "linear-gradient(-90deg, #70ffaf, #70ffaf 70%, white 70%)");
site.data("openGraphColor", "#70ffaf");
site.data("openGraphColor", "/examples", "#fff");
site.use(ogImages());

export default site;

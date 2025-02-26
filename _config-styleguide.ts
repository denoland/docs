// Further refine the global Lume config for this section of the site
import site from "./_config.ts";
import ogImages from "lume/plugins/og_images.ts";

// Ignore everythig not in the styleguide folder
site.ignore((path) => {
  return path.match(/^\/styleguide.*$/) === null;
});

site.data("openGraphLayout", "/open_graph/default.jsx");
site.data("openGraphLayout", "/examples", "/open_graph/examples.jsx");
site.use(ogImages());

export default site;

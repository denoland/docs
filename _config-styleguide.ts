// Further refine the global Lume config for this section of the site

import site from "./_config.ts";
import ogImages from "lume/plugins/og_images.ts";

// site.ignore("runtime");
// site.ignore("apis");

site.ignore((path) => {
  return path.match(/^\/styleguide.*$/) === null;
});

site.data("openGraphLayout", "/og_images.jsx");
site.use(ogImages());

export default site;

// Further refine the global Lume config for this section of the site
import site from "./_config.ts";

// Ignore everythig not in the styleguide folder
site.ignore((path) => {
  return path.match(/^\/styleguide.*$/) === null;
});

export default site;

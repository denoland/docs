const sidebars = {
  subhosting: [
    {
      type: "html",
      value: "<div>Getting Started</div>",
      className: "section-header",
    },
    "manual/index",
    "manual/getting_started",
    "manual/projects_and_deployments",
    "manual/events",
    {
      type: "html",
      value: "<div>REST API</div>",
      className: "section-header",
    },
    "api/index",
    {
      type: "link",
      label: "API Reference Docs",
      href: "https://apidocs.deno.com",
    },
    {
      type: "html",
      value: "<div style='height:30px;'></div>",
    },
  ],
};

module.exports = sidebars;

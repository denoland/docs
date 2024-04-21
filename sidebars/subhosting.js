const sidebars = {
  subhosting: [],

  subhostGuideHome: [
    {
      type: "html",
      value: "<div>Getting Started</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "Quick Start",
      id: "manual/quick_start",
    },
    {
      type: "doc",
      label: "About Subhosting",
      id: "manual/index",
    },
    {
      type: "doc",
      label: "Subhosting Usecases",
      id: "manual/usecases",
    },
    {
      type: "html",
      value: "<div>Subhosting Platform</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "Organizations",
      id: "manual/organizations",
    },
    {
      type: "doc",
      label: "Projects",
      id: "manual/projects",
    },
    {
      type: "doc",
      label: "Deployments",
      id: "manual/deployments",
    },
    {
      type: "doc",
      label: "Custom Domains",
      id: "manual/domains",
    },
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

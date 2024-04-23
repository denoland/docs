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
      label: "About Subhosting",
      id: "manual/index",
    },
    {
      type: "doc",
      label: "Quick Start",
      id: "manual/quick_start",
    },
    {
      type: "doc",
      label: "Planning your implementation",
      id: "manual/planning_your_implementation",
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
      id: "manual/subhosting",
    },
    {
      type: "link",
      label: "Projects",
      href: "/subhosting/manual/subhosting#projects",
    },
    {
      type: "link",
      label: "Deployments",
      href: "/subhosting/manual/subhosting#deployments",
    },
    {
      type: "link",
      label: "Custom Domains",
      href: "/subhosting/manual/subhosting#domains",
    },
    {
      type: "link",
      label: "Connecting a Database",
      href: "./subhosting/manual/subhosting#database",
    },
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

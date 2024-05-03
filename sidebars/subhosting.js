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
      type: "html",
      value: "<div>REST API</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "Resources",
      id: "manual/subhosting",
    },
    "manual/events",
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

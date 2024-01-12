const sidebars = {
  deploy: [],

  deployGuideHome: [
    {
      type: "html",
      value: "<div>Getting Started</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "Quick Start",
      id: "manual/index",
    },
    {
      type: "category",
      label: "Deploy Basics",
      items: [
        "manual/use-cases",
        "manual/playgrounds",
        "manual/how-to-deploy",
        "manual/ci_github",
        "manual/deployctl",
        "manual/regions",
        "manual/pricing-and-limits",
      ],
    },
    {
      type: "html",
      value: "<div>Tutorials &amp; Examples</div>",
      className: "section-header",
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        "tutorials/discord-slash",
        "tutorials/fresh",
        "tutorials/discord-slash",
        "tutorials/fresh",
        "tutorials/index",
        "tutorials/simple-api",
        "tutorials/static-site",
        "tutorials/tutorial-blog-fresh",
        "tutorials/tutorial-dynamodb",
        "tutorials/tutorial-faunadb",
        "tutorials/tutorial-firebase",
        "tutorials/tutorial-http-server",
        "tutorials/tutorial-hugo-blog",
        "tutorials/tutorial-postgres",
        "tutorials/tutorial-wordpress-frontend",
        "tutorials/vite",
      ],
    },
    {
      type: "link",
      label: "More on Deno by Example",
      href: "https://examples.deno.land",
    },
    {
      type: "html",
      value: "<div>Deploy Platform</div>",
      className: "section-header",
    },
    {
      type: "doc",
      id: "manual/deployments",
      label: "Deployments",
    },
    {
      type: "doc",
      id: "manual/custom-domains",
      label: "Custom Domains",
    },
    {
      type: "doc",
      id: "manual/environment-variables",
      label: "Environment Variables",
    },
    {
      type: "doc",
      id: "manual/organizations",
      label: "Organizations",
    },
    {
      type: "doc",
      id: "manual/logs",
      label: "Logs",
    },
    {
      type: "category",
      label: "Subhosting",
      items: [
        "manual/subhosting/index",
        "manual/subhosting/getting_started",
        "manual/subhosting/projects_and_deployments",
      ],
    },
    {
      type: "html",
      value: "<div>Connecting to Databases</div>",
      className: "section-header",
    },
    {
      type: "link",
      href: "/kv/manual/on_deploy",
      label: "Deno KV",
    },
    {
      type: "category",
      label: "Third-Party Databases",
      items: [
        "manual/dynamodb",
        "manual/faunadb",
        "manual/firebase",
        "manual/postgres",
      ],
    },
    {
      type: "html",
      value: "<div>Policies and Limts</div>",
      className: "section-header",
    },
    "manual/fair-use-policy",
    "manual/privacy-policy",
    "manual/security",
    {
      type: "html",
      value: "<div>Reference</div>",
      className: "section-header",
    },
    {
      type: "link",
      label: "API Reference",
      href: "/deploy/api",
    },
    {
      type: "category",
      label: "Runtime APIs",
      items: [
        "api/runtime-fs",
        "api/runtime-node",
        "api/compression",
        "api/runtime-sockets",
        "api/runtime-broadcast-channel",
        "api/runtime-fetch",
        "api/runtime-request",
        "api/runtime-response",
        "api/runtime-headers",
      ],
    },
    {
      type: "category",
      label: "Rest APIs",
      items: [
        "api/rest/index",
        "api/rest/projects",
        "api/rest/deployments",
        "api/rest/domains",
        "api/rest/databases",
        "api/rest/organizations",
      ],
    },
  ],
};

module.exports = sidebars;

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
      label: "KV",
      items: [
        "kv/manual/index",
        "kv/manual/key_space",
        "kv/manual/operations",
        "kv/manual/key_expiration",
        "kv/manual/secondary_indexes",
        "kv/manual/transactions",
        "kv/manual/node",
        "kv/manual/data_modeling_typescript",
        "kv/manual/backup",
      ],
    },
    {
      type: "category",
      label: "Queues",
      items: [
        "kv/manual/queue_overview",
      ],
    },
    {
      type: "category",
      label: "Cron",
      items: [
        "kv/manual/cron",
      ],
    },
    {
      type: "doc",
      id: "manual/edge-cache",
      label: "Edge Cache",
    },
    {
      type: "html",
      value: "<div>Connecting to Databases</div>",
      className: "section-header",
    },
    {
      type: "doc",
      id: "kv/manual/on_deploy",
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
        "manual/neon-postgres",
      ],
    },
    {
      type: "html",
      value: "<div>Policies and Limts</div>",
      className: "section-header",
    },
    "manual/acceptable-use-policy",
    "manual/privacy-policy",
    "manual/security",
    {
      type: "html",
      value: "<div>Tutorials &amp; Examples</div>",
      className: "section-header",
    },
    {
      type: "category",
      label: "Deploy Tutorials",
      items: [
        "tutorials/index",
        "tutorials/discord-slash",
        "tutorials/fresh",
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
        "kv/tutorials/schedule_notification",
        "kv/tutorials/webhook_processor",
      ],
    },
    {
      type: "doc",
      label: "KV Tutorials",
      id: "kv/tutorials/index",
    },
    {
      type: "link",
      label: "More on Deno by Example",
      href: "https://examples.deno.land",
    },
    {
      type: "html",
      value: "<div>Reference</div>",
      className: "section-header",
    },
    {
      type: "link",
      label: "Runtime API",
      href: "/deploy/api",
    },
    "api/runtime-fs",
    "api/runtime-node",
    "api/compression",
    "api/runtime-sockets",
    "api/runtime-broadcast-channel",
    "api/runtime-fetch",
    "api/runtime-request",
    "api/runtime-response",
    "api/runtime-headers",
    {
      type: "html",
      value: "<div style='height:30px;'></div>",
    },
  ],
};

module.exports = sidebars;

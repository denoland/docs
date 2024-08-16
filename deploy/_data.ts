import { Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "Getting Started",
    items: [
      {
        label: "Quick Start",
        id: "/deploy/manual/",
      },
      {
        label: "Deploy Basics",
        items: [
          "/deploy/manual/use-cases/",
          "/deploy/manual/playgrounds/",
          "/deploy/manual/how-to-deploy/",
          "/deploy/manual/ci_github/",
          "/deploy/manual/deployctl/",
          "/deploy/manual/regions/",
          "/deploy/manual/pricing-and-limits/",
        ],
      },
    ],
  },
  {
    title: "Deploy Platform",
    items: [
      {
        label: "Deployments",
        id: "/deploy/manual/deployments/",
      },
      {
        label: "Custom Domains",
        id: "/deploy/manual/custom-domains/",
      },
      {
        label: "Environment Variables",
        id: "/deploy/manual/environment-variables/",
      },
      {
        label: "Organizations",
        id: "/deploy/manual/organizations/",
      },
      {
        label: "Logs",
        id: "/deploy/manual/logs/",
      },
      {
        label: "KV",
        items: [
          "/deploy/kv/manual/",
          "/deploy/kv/manual/key_space/",
          "/deploy/kv/manual/operations/",
          "/deploy/kv/manual/key_expiration/",
          "/deploy/kv/manual/secondary_indexes/",
          "/deploy/kv/manual/transactions/",
          "/deploy/kv/manual/node/",
          "/deploy/kv/manual/data_modeling_typescript/",
          "/deploy/kv/manual/backup/",
        ],
      },
      {
        label: "Queues",
        id: "/deploy/kv/manual/queue_overview/",
      },
      {
        label: "Cron",
        id: "/deploy/kv/manual/cron/",
      },
      {
        label: "Edge Cache",
        id: "/deploy/manual/edge-cache/",
      },
    ],
  },
  {
    title: "Connecting to Databases",
    items: [
      {
        label: "Deno KV",
        id: "/deploy/kv/manual/on_deploy/",
      },
      {
        label: "Third-Party Databases",
        items: [
          "/deploy/manual/dynamodb/",
          "/deploy/manual/faunadb/",
          "/deploy/manual/firebase/",
          "/deploy/manual/postgres/",
          "/deploy/manual/neon-postgres/",
        ],
      },
    ],
  },
  {
    title: "Policies and Limits",
    items: [
      "/deploy/manual/acceptable-use-policy/",
      "/deploy/manual/fulfillment-policy/",
      "/deploy/manual/privacy-policy/",
      "/deploy/manual/security/",
    ],
  },
  {
    title: "Tutorials & Examples",
    items: [
      {
        label: "Deploy Tutorials",
        items: [
          "/deploy/tutorials/",
          "/deploy/tutorials/discord-slash/",
          "/deploy/tutorials/fresh/",
          "/deploy/tutorials/simple-api/",
          "/deploy/tutorials/static-site/",
          "/deploy/tutorials/tutorial-blog-fresh/",
          "/deploy/tutorials/tutorial-dynamodb/",
          "/deploy/tutorials/tutorial-faunadb/",
          "/deploy/tutorials/tutorial-firebase/",
          "/deploy/tutorials/tutorial-http-server/",
          "/deploy/tutorials/tutorial-hugo-blog/",
          "/deploy/tutorials/tutorial-postgres/",
          "/deploy/tutorials/tutorial-wordpress-frontend/",
          "/deploy/tutorials/vite/",
          "/deploy/kv/tutorials/schedule_notification/",
          "/deploy/kv/tutorials/webhook_processor/",
        ],
      },
      {
        label: "KV Tutorials",
        id: "/deploy/kv/tutorials/",
      },
      {
        label: "More on Deno by Example",
        href: "/examples",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        label: "Runtime API",
        href: "/deploy/api",
      },
      "/deploy/api/runtime-fs/",
      "/deploy/api/runtime-node/",
      "/deploy/api/compression/",
      "/deploy/api/runtime-sockets/",
      "/deploy/api/runtime-broadcast-channel/",
      "/deploy/api/runtime-fetch/",
      "/deploy/api/runtime-request/",
      "/deploy/api/runtime-response/",
      "/deploy/api/runtime-headers/",
      "/deploy/api/dynamic-import/",
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deploy";
export const sectionHref = "/deploy/manual/";

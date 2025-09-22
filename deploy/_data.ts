import { Sidebar, SidebarNav } from "../types.ts";

export const sidebar = [
  {
    title: "Getting started",
    items: [
      {
        title: "Quick start",
        href: "/deploy/classic/",
      },
      {
        title: "Deploy basics",
        items: [
          { title: "Use cases", href: "/deploy/classic/use-cases/" },
          { title: "Playgrounds", href: "/deploy/classic/playgrounds/" },
          { title: "How to deploy", href: "/deploy/classic/how-to-deploy/" },
          { title: "GitHub CI", href: "/deploy/classic/ci_github/" },
          { title: "deployctl", href: "/deploy/classic/deployctl/" },
          { title: "Regions", href: "/deploy/classic/regions/" },
          {
            title: "Pricing and limits",
            href: "/deploy/classic/pricing-and-limits/",
          },
        ],
      },
    ],
  },
  {
    title: "Deploy Classic",
    items: [
      {
        title: "Deployments",
        href: "/deploy/classic/deployments/",
      },
      {
        title: "Custom domains",
        href: "/deploy/classic/custom-domains/",
      },
      {
        title: "Environment variables",
        href: "/deploy/classic/environment-variables/",
      },
      {
        title: "Organizations",
        href: "/deploy/classic/organizations/",
      },
      {
        title: "Logs",
        href: "/deploy/classic/logs/",
      },
      {
        title: "KV",
        items: [
          { title: "Overview", href: "/deploy/kv/manual/" },
          { title: "Key space", href: "/deploy/kv/manual/key_space/" },
          { title: "Operations", href: "/deploy/kv/manual/operations/" },
          {
            title: "Key expiration",
            href: "/deploy/kv/manual/key_expiration/",
          },
          {
            title: "Secondary indexes",
            href: "/deploy/kv/manual/secondary_indexes/",
          },
          { title: "Transactions", href: "/deploy/kv/manual/transactions/" },
          { title: "Node", href: "/deploy/kv/manual/node/" },
          {
            title: "Data modeling",
            href: "/deploy/kv/manual/data_modeling_typescript/",
          },
          { title: "Backup", href: "/deploy/kv/manual/backup/" },
        ],
      },
      {
        title: "Queues",
        href: "/deploy/kv/manual/queue_overview/",
      },
      {
        title: "Cron",
        href: "/deploy/kv/manual/cron/",
      },
      {
        title: "Edge cache",
        href: "/deploy/classic/edge-cache/",
      },
    ],
  },
  {
    title: "Connecting to databases",
    items: [
      {
        title: "Deno KV",
        href: "/deploy/kv/manual/on_deploy/",
      },
      {
        title: "Third-Party Databases",
        items: [
          { title: "DynamoDB", href: "/deploy/classic/dynamodb/" },
          { title: "FaunaDB", href: "/deploy/classic/faunadb/" },
          { title: "Firebase", href: "/deploy/classic/firebase/" },
          { title: "Postgres", href: "/deploy/classic/postgres/" },
          { title: "Neon Postgres", href: "/deploy/classic/neon-postgres/" },
          {
            title: "Prisma Postgres",
            href: "/deploy/classic/prisma-postgres/",
          },
        ],
      },
    ],
  },
  {
    title: "Policies and Limits",
    items: [
      {
        title: "Acceptable Use Policy",
        href: "/deploy/classic/acceptable-use-policy/",
      },
      {
        title: "Fulfillment Policy",
        href: "/deploy/classic/fulfillment-policy/",
      },
      { title: "Privacy Policy", href: "/deploy/classic/privacy-policy/" },
      { title: "Security", href: "/deploy/classic/security/" },
      {
        title: "Terms and Conditions",
        href: "/deploy/classic/terms-and-conditions/",
      },
    ],
  },
  {
    title: "Tutorials & Examples",
    items: [
      {
        title: "Deploy Tutorials",
        items: [
          { title: "Overview", href: "/deploy/tutorials/" },
          {
            title: "Discord Slash Commands",
            href: "/deploy/tutorials/discord-slash/",
          },
          { title: "Fresh Framework", href: "/deploy/tutorials/fresh/" },
          { title: "Simple API", href: "/deploy/tutorials/simple-api/" },
          { title: "Static Site", href: "/deploy/tutorials/static-site/" },
          {
            title: "Blog with Fresh",
            href: "/deploy/tutorials/tutorial-blog-fresh/",
          },
          {
            title: "DynamoDB Integration",
            href: "/deploy/tutorials/tutorial-dynamodb/",
          },
          {
            title: "FaunaDB Integration",
            href: "/deploy/tutorials/tutorial-faunadb/",
          },
          {
            title: "Firebase Integration",
            href: "/deploy/tutorials/tutorial-firebase/",
          },
          {
            title: "HTTP Server",
            href: "/deploy/tutorials/tutorial-http-server/",
          },
          { title: "Hugo Blog", href: "/deploy/tutorials/tutorial-hugo-blog/" },
          {
            title: "Postgres Integration",
            href: "/deploy/tutorials/tutorial-postgres/",
          },
          {
            title: "WordPress Frontend",
            href: "/deploy/tutorials/tutorial-wordpress-frontend/",
          },
          { title: "Vite", href: "/examples/react_tutorial/" },
          {
            title: "Schedule Notification",
            href: "/deploy/kv/tutorials/schedule_notification/",
          },
          {
            title: "Webhook Processor",
            href: "/deploy/kv/tutorials/webhook_processor/",
          },
        ],
      },
      {
        title: "KV Tutorials",
        href: "/deploy/kv/tutorials/",
      },
      {
        title: "More on Deno by Example",
        href: "/examples/",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Runtime API", href: "/deploy/api" },
      { title: "Runtime FS", href: "/deploy/api/runtime-fs/" },
      { title: "Runtime Node", href: "/deploy/api/runtime-node/" },
      { title: "Compression", href: "/deploy/api/compression/" },
      { title: "Runtime Sockets", href: "/deploy/api/runtime-sockets/" },
      {
        title: "Runtime Broadcast Channel",
        href: "/deploy/api/runtime-broadcast-channel/",
      },
      { title: "Runtime Fetch", href: "/deploy/api/runtime-fetch/" },
      { title: "Runtime Request", href: "/deploy/api/runtime-request/" },
      { title: "Runtime Response", href: "/deploy/api/runtime-response/" },
      { title: "Runtime Headers", href: "/deploy/api/runtime-headers/" },
      { title: "Dynamic Import", href: "/deploy/api/dynamic-import/" },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deploy";
export const sectionHref = "/deploy/classic/";
export const SidebarNav = [
  {
    title: "Deno Deploy<sup>EA</sup>",
    href: "/deploy/early-access/",
  },
  {
    title: "Deploy Classic",
    href: "/deploy/classic/",
  },
  {
    title: "Subhosting",
    href: "/subhosting/manual/",
  },
] satisfies SidebarNav;

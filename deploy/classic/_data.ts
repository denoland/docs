import { Sidebar, SidebarNav } from "../../types.ts";

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
            href: "/deploy/pricing_and_limits/",
          },
        ],
      },
    ],
  },
  {
    title: "Deploy platform",
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
        title: "Queues",
        href: "/deploy/classic/queues/",
      },
      {
        title: "Cron",
        href: "/deploy/classic/cron/",
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
        href: "/deploy/classic/kv_on_deploy/",
      },
      {
        title: "Third-Party Databases",
        items: [
          { title: "DynamoDB", href: "/deploy/classic/dynamodb/" },
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
    title: "Reference",
    items: [
      { title: "Runtime API", href: "/deploy/classic/api/" },
      { title: "Runtime FS", href: "/deploy/classic/api/runtime-fs/" },
      { title: "Runtime Node", href: "/deploy/classic/api/runtime-node/" },
      { title: "Compression", href: "/deploy/classic/api/compression/" },
      {
        title: "Runtime Sockets",
        href: "/deploy/classic/api/runtime-sockets/",
      },
      {
        title: "Runtime Broadcast Channel",
        href: "/deploy/classic/api/runtime-broadcast-channel/",
      },
      { title: "Runtime Fetch", href: "/deploy/classic/api/runtime-fetch/" },
      {
        title: "Runtime Request",
        href: "/deploy/classic/api/runtime-request/",
      },
      {
        title: "Runtime Response",
        href: "/deploy/classic/api/runtime-response/",
      },
      {
        title: "Runtime Headers",
        href: "/deploy/classic/api/runtime-headers/",
      },
      { title: "Dynamic Import", href: "/deploy/classic/api/dynamic-import/" },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deploy";
export const sectionHref = "/deploy/classic/";
export const SidebarNav = [
  {
    title: "Deno Deploy",
    href: "/deploy/",
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

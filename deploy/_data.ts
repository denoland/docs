import { Sidebar, SidebarNav } from "../types.ts";

export const sidebar = [
  {
    title: "Deno Deploy",
    items: [
      { title: "About", href: "/deploy/" },
      {
        title: "Getting started",
        href: "/deploy/getting_started/",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "Accounts",
        href: "/deploy/reference/accounts/",
      },
      {
        title: "Organizations",
        href: "/deploy/reference/organizations/",
      },
      {
        title: "Apps",
        href: "/deploy/reference/apps/",
      },
      {
        title: "Builds",
        href: "/deploy/reference/builds/",
      },
      {
        title: "Environment Variables and Contexts",
        href: "/deploy/reference/env-vars-and-contexts/",
      },
      {
        title: "Timelines",
        href: "/deploy/reference/timelines/",
      },
      {
        title: "Observability",
        href: "/deploy/reference/observability/",
      },
      {
        title: "Domains",
        href: "/deploy/reference/domains/",
      },
      {
        title: "Deno KV",
        href: "/deploy/reference/deno-kv/",
      },
      {
        title: "Databases",
        href: "/deploy/reference/databases/",
      },
      {
        title: "Cloud Connections",
        href: "/deploy/reference/cloud-connections/",
      },
      {
        title: "OIDC",
        href: "/deploy/reference/oidc/",
      },
      {
        title: "Runtime",
        href: "/deploy/reference/runtime/",
      },
      {
        title: "Framework support",
        href: "/deploy/reference/frameworks/",
      },
      {
        title: "CDN and caching",
        href: "/deploy/reference/caching/",
      },
      {
        title: "Playgrounds",
        href: "/deploy/reference/playgrounds/",
      },
      {
        title: "Deploy Button",
        href: "/deploy/reference/button/",
      },
    ],
  },
  {
    title: "KV",
    items: [
      { title: "Overview", href: "/deploy/kv/" },
      { title: "Key space", href: "/deploy/kv/key_space/" },
      { title: "Operations", href: "/deploy/kv/operations/" },
      {
        title: "Key expiration",
        href: "/deploy/kv/key_expiration/",
      },
      {
        title: "Secondary indexes",
        href: "/deploy/kv/secondary_indexes/",
      },
      { title: "Transactions", href: "/deploy/kv/transactions/" },
      { title: "Node", href: "/deploy/kv/node/" },
      {
        title: "Data modeling",
        href: "/deploy/kv/data_modeling_typescript/",
      },
      { title: "Backup", href: "/deploy/kv/backup/" },
    ],
  },
  {
    title: "Policies and Limits",
    items: [
      {
        title: "Usage and Limitations",
        href: "/deploy/usage/",
      },
      {
        title: "Acceptable Use Policy",
        href: "/deploy/acceptable-use-policy/",
      },
      {
        title: "Fulfillment Policy",
        href: "/deploy/fulfillment-policy/",
      },
      { title: "Privacy Policy", href: "/deploy/privacy-policy/" },
      { title: "Security", href: "/deploy/security/" },
      {
        title: "Terms and Conditions",
        href: "/deploy/terms-and-conditions/",
      },
    ],
  },
  {
    title: "Support and Feedback",
    items: [
      {
        title: "Changelog",
        href: "/deploy/changelog/",
      },
      { title: "Support", href: "/deploy/support/" },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deno Deploy";
export const sectionHref = "/deploy/";
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

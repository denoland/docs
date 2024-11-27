import { Sidebar } from "../../types.ts";

export const sidebar = [
  {
    title: "Basics",
    items: [
      {
        label: "Hello World!",
        id: "/learn/tutorials/hello_world/",
      },
      {
        label: "Fetch data",
        id: "/learn/tutorials/fetch_data/",
      },
      {
        label: "Executable scripts",
        id: "/learn/tutorials/hashbang/",
      },
      {
        label: "Updating from CommonJS to ESM",
        id: "/learn/tutorials/cjs_to_esm/",
      },
      {
        label: "Write a file server",
        id: "/learn/tutorials/file_server/",
      },
    ],
  },
  {
    title: "Web frameworks and libraries",
    items: [
      {
        label: "Build a React App",
        id: "/learn/tutorials/react/",
      },
      {
        label: "Build a React app with create-vite",
        id: "/learn/tutorials/react/create-react/",
      },
      {
        label: "Build a Next.js app",
        id: "/learn/tutorials/next/",
      },
      {
        label: "Build a Fresh app",
        id: "https://fresh.deno.dev/docs/getting-started/create-a-project",
      },
      {
        label: "Build a Vue app",
        id: "/learn/tutorials/vue/",
      },
      {
        label: "Use Express with Deno",
        id: "/learn/tutorials/express/",
      },
      {
        label: "How to use Apollo with Deno",
        id: "/learn/tutorials/apollo/",
      },
    ],
  },
  {
    title: "Deploying Deno projects",
    items: [
      {
        label: "AWS Lambda",
        id: "/learn/tutorials/aws_lambda/",
      },
      {
        label: "AWS Lightsail",
        id: "/learn/tutorials/aws_lightsail/",
      },
      {
        label: "Cloudflare workers",
        id: "/learn/tutorials/cloudflare_workers/",
      },
      {
        label: "Digital Ocean",
        id: "/learn/tutorials/digital_ocean/",
      },
      {
        label: "Google Cloud Run",
        id: "/learn/tutorials/google_cloud_run/",
      },
      {
        label: "Kinsta",
        id: "/learn/tutorials/kinsta/",
      },
    ],
  },
  {
    title: "Connecting to Databases",
    items: [
      {
        label: "Connecting to databases",
        id: "/learn/tutorials/connecting_to_databases/",
      },
      {
        label: "Use MySQL2 with Deno",
        id: "/learn/tutorials/mysql2/",
      },
      {
        label: "Use PlanetScale with Deno",
        id: "/learn/tutorials/planetscale/",
      },
      {
        label: "Use Redis with Deno",
        id: "/learn/tutorials/redis/",
      },
      {
        label: "Mongoose and MongoDB",
        id: "/learn/tutorials/mongoose/",
      },
      {
        label: "Use Prisma with Deno",
        id: "/learn/tutorials/prisma/",
      },
    ],
  },
  {
    title: "Advanced",
    items: [
      {
        label: "Create a subprocess",
        id: "/learn/tutorials/subprocess/",
      },
      {
        label: "Handle OS signals",
        id: "/learn/tutorials/os_signals/",
      },
      {
        label: "File system events",
        id: "/learn/tutorials/file_system_events/",
      },
      {
        label: "Module Metadata",
        id: "/learn/tutorials/module_metadata/",
      },
      {
        label: "File Based Routing",
        id: "/learn/tutorials/file_based_routing/",
      },
      {
        label: "Build a chat app with WebSockets",
        id: "/learn/tutorials/chat_app/",
      },
      {
        label: "Build a word finder app",
        id: "/learn/tutorials/word_finder/",
      }
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Tutorials";
export const sectionHref = "/learn/tutorials";

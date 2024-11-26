import { TutorialList } from "../_components/TutorialList.tsx";

export default function TutorialPage() {
  return (
    <>
      <h1>Tutorials and Guides</h1>
      <p>Walkthrough tutorials and guides to teach you about the Deno runtime and how to use it with your favorite tools.</p>

      <TutorialList group="Basics" name="Hello World" link="/runtime/tutorials/hello_world/" />


    </>
  );
// }

// <h2>Basics</h2>

// - [Hello World](/runtime/tutorials/hello_world/)
// - [Fetch and stream data](/runtime/tutorials/fetch_data/)
// - [Make executable scripts](/runtime/tutorials/hashbang/)
// - [Convert CJS to ESM](/runtime/tutorials/cjs_to_esm/)
// - [Write a file server](/runtime/tutorials/file_server/)

// <h2>Web frameworks and libraries</h2>

// - [React](/runtime/tutorials/how_to_with_npm/react/)
// - [Next.js](/runtime/tutorials/how_to_with_npm/next/)
// - [Fresh](https://fresh.deno.dev/docs/getting-started/create-a-project)
// - [Vue.js](/runtime/tutorials/how_to_with_npm/vue/)
// - [Express](/runtime/tutorials/how_to_with_npm/express/)
// - [Apollo GraphQL](/runtime/tutorials/how_to_with_npm/apollo/)

// <h2>Deploying Deno projects</h2>

// - [AWS Lambda](/runtime/tutorials/aws_lambda/)
// - [AWS Lightsail](/runtime/tutorials/aws_lightsail/)
// - [Cloudflare Workers](/runtime/tutorials/cloudflare_workers/)
// - [Digital Ocean](/runtime/tutorials/digital_ocean/)
// - [Google Cloud Run](/runtime/tutorials/google_cloud_run/)
// - [Kinsta](/runtime/tutorials/kinsta/)

// <h2>Connecting to Databases</h2>

// - [Connecting to databases](/runtime/tutorials/connecting_to_databases/) (MySQL,
//   PostgreSQL, SQLite, MongoDB, Redis, Firebase, Supabase, GraphQL and more)
// - [MySQL2](/runtime/tutorials/how_to_with_npm/mysql2/)
// - [PlanetScale](/runtime/tutorials/how_to_with_npm/planetscale/)
// - [Redis](/runtime/tutorials/how_to_with_npm/redis/)
// - [Mongoose and MongoDB](/runtime/tutorials/how_to_with_npm/mongoose/)
// - [Prisma](/runtime/tutorials/how_to_with_npm/prisma/)

// <h2>Advanced</h2>

// - [Create a subprocess](/runtime/tutorials/subprocess/)
// - [Handle OS signals](/runtime/tutorials/os_signals/)
// - [File system events](/runtime/tutorials/file_system_events/)
// - [Module Metadata](/runtime/tutorials/module_metadata/)

// Additional examples can by found at
// [Deno by Example](https://docs.deno.com/examples/).

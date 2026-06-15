/**
 * @title Connect to Postgres
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://www.npmjs.com/package/postgres} postgres on npm
 * @group Databases
 *
 * Using the npm Postgres client, you can connect to a Postgres database
 * running anywhere. Connection settings belong in environment variables
 * rather than in the source, so the same code runs against your local
 * database and production.
 */

// Import the Postgres package from npm
import postgres from "npm:postgres";

// Read the connection settings from the standard libpq environment
// variables. Locally you might set PGDATABASE=test and nothing else;
// in production a managed database provides all of them. A common pattern
// is to keep these in a .env file and load it with the --env-file flag,
// for example: deno run --env-file -N -E main.ts
const sql = postgres({
  host: Deno.env.get("PGHOST") ?? "localhost",
  port: Number(Deno.env.get("PGPORT") ?? 5432),
  user: Deno.env.get("PGUSER") ?? "postgres",
  password: Deno.env.get("PGPASSWORD"),
  database: Deno.env.get("PGDATABASE") ?? "postgres",
});

// Execute a SQL query. Connections open lazily on first use, so this is
// the first place a bad address or password surfaces; handle it instead
// of leaking a stack trace, and close the connection pool either way.
// Connection failures arrive as an AggregateError with the cause on its
// code property, for example ECONNREFUSED when nothing is listening.
try {
  const people = await sql`
    SELECT id, name FROM people
  `;
  console.log(people);
} catch (error) {
  const reason = (error as { code?: string }).code ?? String(error);
  console.error("Query failed:", reason); // Query failed: ECONNREFUSED
} finally {
  // Close the connection to the database
  await sql.end();
}

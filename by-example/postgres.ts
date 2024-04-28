/**
 * @title Connect to Postgres
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net --allow-env <url>
 * @resource {https://deno-postgres.com/} Deno Postgres docs
 * @resource {https://deno.land/x/postgres} Deno Postgres on deno.land/x
 *
 * Using the Deno Postgres client, you can connect to a Postgres database
 * running anywhere.
 */

// Import the Client constructor from deno.land/x
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Initialize the client with connection information for your database, and
// create a connection.
const client = new Client({
  user: "user",
  database: "test",
  hostname: "localhost",
  port: 5432,
});
await client.connect();

// Execute a SQL query
const result = await client.queryArray("SELECT ID, NAME FROM PEOPLE");
console.log(result.rows); // [[1, 'Carlos'], [2, 'John'], ...]

// Close the connection to the database
await client.end();

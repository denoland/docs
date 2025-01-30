/**
 * @title Connect to Postgres
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net --allow-env <url>
 * @group Databases
 *
 * Using the npm Postgres client, you can connect to a Postgres database
 * running anywhere.
 */

// Import the Postgres package from 
import postgres from "npm:postgres";

// Initialize the client with connection information for your database, and
// create a connection. 
const sql = postgres({
  user: "user",
  database: "test",
  hostname: "localhost",
  port: 5432,
});

// Execute a SQL query
const result = await sql`
  SELECT ID, NAME FROM PEOPLE
`;
console.log(result); 

// Close the connection to the database
await sql.end();

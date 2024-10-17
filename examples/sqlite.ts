/**
 * @title Connect to SQLite
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-read --allow-write --allow-env --allow-net --allow-ffi <url>
 * @resource {https://jsr.io/@db/sqlite} @db/sqlite on JSR
 * @group Databases
 *
 * Using the Deno SQLite3 module, you can connect to an SQLite3 database
 * stored locally and perform basic database operations.
 */

// Import the Database class from jsr:@db/sqlite
import { Database } from "jsr:@db/sqlite@0.12";

// Open or create an SQLite database named 'test.db'
const db = new Database("test.db");

// Create a table called "people" if it doesn't exist
db.prepare(
  `
	CREATE TABLE IF NOT EXISTS people (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  name TEXT,
	  age INTEGER
	);
  `,
).run();

// Insert a new row into the "people" table
db.prepare(
  `
	INSERT INTO people (name, age) VALUES (?, ?);
  `,
).run("Bob", 40);

// Query all rows from the "people" table
const rows = db.prepare("SELECT id, name, age FROM people").all();
console.log("People:");
for (const row of rows) {
  console.log(row);
}

// Close the database connection
db.close();

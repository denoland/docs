/**
 * @title Connect to SQLite
 * @difficulty beginner
 * @tags cli, deploy
 * @run --allow-read --allow-write <url>
 * @group Databases
 *
 * Using the `node:sqlite` module, you can connect to an SQLite3 database
 * stored locally and perform basic database operations.
 *
 * _`node:sqlite` module has been added in Deno v2.2._
 */

// Import the DatabaseSync class from node:sqlite
import { DatabaseSync } from "node:sqlite";

// Open or create an SQLite database named 'test.db'
const db = new DatabaseSync("test.db");

// Create a table called "people" if it doesn't exist
db.exec(
  `
	CREATE TABLE IF NOT EXISTS people (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  name TEXT,
	  age INTEGER
	);
  `,
);

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

/**
 * @title Connect to DuckDB
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-read --allow-write --allow-env --allow-net --allow-ffi <url>
 * @resource {https://deno.land/x/duckdb} Deno DuckDB on deno.land/x
 * @resource {https://duckdb.org/} DuckDB - An in-process SQL OLAP database management system
 * @resource {https://github.com/suketa/ruby-duckdb?tab=readme-ov-file#pre-requisite-setup-linux} DuckDB Pre-requisite setup (Linux)
 * @group Databases
 *
 * Using the Deno with DuckDB, you can connect to memory or a persistent
 * database with a filename.
 */

import { open } from "https://deno.land/x/duckdb/mod.ts";

// const db = open("./example.db");
const db = open(":memory:");

const connection = db.connect();

const prepared = connection.prepare(
  "SELECT ?::INTEGER AS number, ?::VARCHAR AS text;",
);

const result = prepared.query(1337, "foo"); // [{ number: 1337, text: 'foo' }]

console.debug(`Number: ${result[0].number}`);
console.debug(`Text: ${result[0].text}`);

connection.close();
db.close();

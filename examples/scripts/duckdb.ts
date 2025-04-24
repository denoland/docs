/**
 * @title Connect to DuckDB
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-read --allow-write --allow-env --allow-net --allow-ffi <url>
 * @resource {https://duckdb.org/} DuckDB - An in-process SQL OLAP database management system
 * @resource {https://www.npmjs.com/package/@duckdb/node-api} Official high-level API for DuckDB
 * @group Databases
 *
 * Using Deno with DuckDB, you can connect to memory or a persistent
 * database with a filename.
 */

import { DuckDBInstance } from "npm:@duckdb/node-api";

const instance = await DuckDBInstance.create(":memory:");
// Or you can specify a path to a persistent database
// const instance = await DuckDBInstance.create("./my_duckdb.db");

const connection = await instance.connect();

// Simple select query
const reader = await connection.runAndReadAll("select 10, 'foo'");
const rows = reader.getRows();

console.debug(rows); // [ [ 10, "foo" ] ]

// Prepared statement
const prepared = await connection.prepare("select $1, $2");
prepared.bindInteger(1, 20);
prepared.bindVarchar(2, "bar");
const reader2 = await prepared.runAndReadAll();
const rows2 = reader2.getRows();

console.debug(rows2); // [ [ 20, "bar" ] ]

/**
 * @title HTTP server: Performing CRUD operations using SQLite3
 * @difficulty intermediate
 * @tags web, cli, deploy
 * @run -A <url>
 * @group Network
 *
 * An example of a HTTP server for CRUD routes with oak middleware framework and SQLite3 database.
 * It demonstrates the CRUD(Create, Read, Update and Delete) operations on file-based SQLite Database using HTTP methods (Get, Post, Put, Delete, Options)
 */

import { Application, Router } from "jsr:@oak/oak";
import { Database } from "jsr:@db/sqlite";

// Open a database from file, creates if doesn't exist. here the 'people.db' is a file-based database
const peopleDb = new Database("people.db");

// Create Table "people" if not exists with schema as shown below
peopleDb.exec(
  "CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT not null,age INTEGER not null)",
);
// logs the DB creation status
console.log("People table created successfully ");

const app = new Application();
const router = new Router();
const PORT = "8369";
// Create person record into people database
router.post("/people", async (ctx) => {
  const { name, age } = await ctx.request.body.json();
  const result = await peopleDb.prepare(
    "INSERT INTO people (name, age) VALUES (?,?)",
  )
    .run(name, age);
  // Get the last inserted row ID
  const lastInsertRowId = await peopleDb.lastInsertRowId;
  ctx.response.status = 201;
  ctx.response.body = { id: lastInsertRowId, name, age };
});

// Read all records from people database
router.get("/people", async (ctx) => {
  const users = await peopleDb.prepare("SELECT * FROM people").all();
  ctx.response.body = users;
});

// Updates person record in people database (name value is optional)
router.put("/people/:id", async (ctx) => {
  const id = ctx.params.id;
  const { name, age } = await ctx.request.body.json();
  let result = 0;
  if (name) {
    result = await peopleDb.prepare(
      "UPDATE people SET name =?, age=? WHERE id = ?",
    )
      .run(name, age, id);
  } else {
    result = await peopleDb.prepare(
      "UPDATE people SET age=? WHERE id = ?",
    )
      .run(age, id);
  }
  ctx.response.body = result > 0
    ? { message: "person updated successfully as requested" }
    : { message: "Failure in update operation" };
});

// Delete person record from people database
router.delete("/people/:id", async (ctx) => {
  const result = await peopleDb.prepare("DELETE FROM people WHERE id = ?").run(
    ctx.params.id,
  );
  ctx.response.body = result > 0
    ? { message: "person removed successfully as requested" }
    : { message: "Failure in deletion operation" };
});

// Health check endpoint
router.options("/healthz", async (ctx) => {
  ctx.response.body = { message: `health check verified` };
});

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
// Export the app instance for testing
export default app;

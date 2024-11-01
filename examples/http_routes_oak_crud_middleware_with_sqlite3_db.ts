/**
 * @title HTTP server: Performing CRUD operations using SQLite3
 * @difficulty intermediate
 * @tags web, cli, deploy
 * @run -A <url>
 * @group Network
 *
 * An example of a HTTP server for CRUD routes with oak middleware framework and SQLite3 database.It demonstrates the CRUD(Create, Read, Update and Delete) operations on file-based SQLite Database using HTTP methods (Get, Post, Put, Delete, Options)
 */
import { Application, Router } from "jsr:@oak/oak";
import { Database } from "jsr:@db/sqlite";
// Open a database from file, creates if doesn't exist. here the 'people.db' is a file-based database
const peopleDb = new Database("people.db");
peopleDb.exec(
  "CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT not null,age INTEGER not null)",
);
const app = new Application();
const router = new Router();
router.post("/people", async (ctx) => {
  const { name, age } = await ctx.request.body.json();
  await peopleDb.prepare("INSERT INTO people (name, age) VALUES (?,?)").run(
    name,
    age,
  );
  const lastInsertRowId = await peopleDb.lastInsertRowId; // Get the last inserted row ID
  ctx.response.status = 201;
  ctx.response.body = { id: lastInsertRowId, name, age };
});
router.get("/people", async (ctx) => {
  const users = await peopleDb.prepare("SELECT * FROM people").all();
  ctx.response.body = users;
});
router.put("/people/:id", async (ctx) => {
  const { name, age } = await ctx.request.body.json();
  await peopleDb.prepare("UPDATE people SET name =?, age=? WHERE id = ?").run(
    name,
    age,
    ctx.params.id,
  );
  ctx.response.body = { message: "person updated successfully as requested" };
});
router.delete("/people/:id", async (ctx) => {
  await peopleDb.prepare("DELETE FROM people WHERE id = ?").run(ctx.params.id);
  ctx.response.body = "person removed successfully as requested";
});
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: "8369" }); // Any available port number can be defined here
export default app; // Export the app instance for testing

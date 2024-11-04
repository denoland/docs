/**
 * @title HTTP server: Performing CRUD operations using SQLite3
 * @difficulty intermediate
 * @tags web, cli, deploy
 * @run -A <url>
 * @resource {https://jsr.io/@oak/oak} Doc: @oak/oak/README.md
 * @resource {https://jsr.io/@db/sqlite} @db/sqlite on JSR
 * @group Network
 *
 * An example of a HTTP server for CRUD routes with oak middleware framework and SQLite3 database.It demonstrates the CRUD(Create, Read, Update and Delete) operations on file-based SQLite Database using HTTP methods (Get, Post, Put, Delete, Options)
 */
import { Application, Router } from "jsr:@oak/oak";
import { Database } from "jsr:@db/sqlite";
// Open a database from in-memory database or file. here an in-memory database is used for CRUD demonstration.
const peopleDb = new Database(":memory:");
peopleDb.exec(
  "CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT not null,age INTEGER not null)",
);
const app = new Application();
const router = new Router();
router
  .post("/people", async (ctx) => {
    const { name, age } = await ctx.request.body.json();
    peopleDb.exec("INSERT INTO people (name, age) VALUES (?,?)", name, age);
    const lastInsertRowId = peopleDb.lastInsertRowId; // Get the last inserted row ID
    ctx.response.status = 201;
    ctx.response.body = { id: lastInsertRowId, name, age };
  });
router.get("/people", (ctx) => {
  const users = peopleDb.prepare("SELECT * FROM people").all();
  ctx.response.body = users;
});
router.put("/people/:id", async (ctx) => {
  const { name, age } = await ctx.request.body.json();
  peopleDb.prepare("UPDATE people SET name =?, age=? WHERE id = ?").run(
    name,
    age,
    ctx.params.id,
  );
  ctx.response.body = { message: "person updated successfully as requested" };
});
router.delete("/people/:id", (ctx) => {
  peopleDb.prepare("DELETE FROM people WHERE id = ?").run(ctx.params.id);
  ctx.response.body = "person removed successfully as requested";
});
app.use(router.routes());
app.use(router.allowedMethods());
const PORT = 8369; // Any available port number can be defined here
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });

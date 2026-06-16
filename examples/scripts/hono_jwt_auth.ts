/**
 * @title Protect routes with JWT in Hono
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://hono.dev/docs/middleware/builtin/jwt} Hono JWT middleware
 * @resource {https://www.npmjs.com/package/hono} hono on npm
 * @group Network
 *
 * A common auth pattern is issuing a JSON Web Token at login and requiring it
 * on protected routes. Hono ships a JWT helper to sign tokens and middleware
 * to verify them, attaching the decoded payload to the request. Set JWT_SECRET
 * before running.
 */

import { Hono } from "npm:hono";
import { jwt, sign } from "npm:hono/jwt";

const secret = Deno.env.get("JWT_SECRET") ?? "dev-secret-change-me";
const app = new Hono();

// Issue a token. In a real app you would verify the user's credentials first,
// then put their id and roles in the payload.
app.post("/login", async (c) => {
  const token = await sign({ sub: "user-123", role: "admin" }, secret);
  return c.json({ token });
});

// The jwt middleware rejects requests without a valid Bearer token and, when
// valid, stores the decoded payload for handlers to read.
app.use("/api/*", jwt({ secret, alg: "HS256" }));

app.get("/api/me", (c) => {
  const payload = c.get("jwtPayload");
  return c.json({ payload });
});

// Try it:
//   curl -XPOST localhost:8000/login           -> { "token": "..." }
//   curl localhost:8000/api/me -H "Authorization: Bearer <token>"
Deno.serve(app.fetch);

/**
 * @title Email and password auth with Better Auth
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E -R -W <url>
 * @resource {https://www.better-auth.com/} Better Auth
 * @resource {https://www.npmjs.com/package/better-auth} better-auth on npm
 * @group Network
 *
 * Better Auth is a framework-agnostic, TypeScript-first auth library. It needs
 * a database; this uses Deno's built-in node:sqlite so there is nothing extra
 * to install. Generate the tables once with `deno run -A npm:@better-auth/cli
 * migrate`, then run this. Better Auth serves its routes under /api/auth.
 */

import { betterAuth } from "npm:better-auth";
import { DatabaseSync } from "node:sqlite";

export const auth = betterAuth({
  database: new DatabaseSync("auth.db"),
  // Enable classic email and password accounts. Social providers can be added
  // alongside this with socialProviders: { github: { ... } }.
  emailAndPassword: { enabled: true },
});

// auth.handler takes a Request and returns a Response. Routes live under
// /api/auth, e.g. POST /api/auth/sign-up/email and /api/auth/sign-in/email.
Deno.serve((req) => auth.handler(req));

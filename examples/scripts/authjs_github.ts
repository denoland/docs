/**
 * @title Authentication with Auth.js
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://authjs.dev/} Auth.js
 * @resource {https://www.npmjs.com/package/@auth/core} @auth/core on npm
 * @group Network
 *
 * Auth.js is the most widely used authentication library for JavaScript. Its
 * framework-agnostic core is built on the Web standard Request and Response,
 * so it drops straight into Deno.serve. This wires up GitHub sign-in; Auth.js
 * serves all its routes (sign-in, callback, session, sign-out) under /auth.
 * Set AUTH_SECRET (run `deno run -A npm:@auth/core` or `openssl rand -hex 32`),
 * GITHUB_CLIENT_ID, and GITHUB_CLIENT_SECRET.
 */

import { Auth } from "npm:@auth/core";
import GitHub from "npm:@auth/core/providers/github";

const config = {
  // trustHost is needed outside managed platforms like Vercel.
  trustHost: true,
  secret: Deno.env.get("AUTH_SECRET"),
  providers: [
    GitHub({
      clientId: Deno.env.get("GITHUB_CLIENT_ID"),
      clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET"),
    }),
  ],
};

// Auth() takes a Request and returns a Response, so it is the whole handler.
// Visit http://localhost:8000/auth/signin to start the flow.
Deno.serve((req) => Auth(req, config));

/**
 * @title Sign in with GitHub using Arctic
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://arcticjs.dev/} Arctic OAuth library
 * @resource {https://www.npmjs.com/package/arctic} arctic on npm
 * @group Network
 *
 * Arctic is a small OAuth 2.0 library with built-in support for dozens of
 * providers, so you do not hand-write each provider's endpoints. This mirrors
 * the from-scratch GitHub OAuth example, but Arctic builds the authorization
 * URL and exchanges the code for you. Register an OAuth app with callback
 * http://localhost:8000/callback, then set GITHUB_CLIENT_ID and
 * GITHUB_CLIENT_SECRET.
 */

import { generateState, GitHub } from "npm:arctic";

const github = new GitHub(
  Deno.env.get("GITHUB_CLIENT_ID")!,
  Deno.env.get("GITHUB_CLIENT_SECRET")!,
  "http://localhost:8000/callback",
);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Step 1: build the authorization URL and send the user to GitHub. In a real
  // app, store `state` in a cookie and check it in the callback.
  if (url.pathname === "/") {
    const state = generateState();
    const authorizationURL = github.createAuthorizationURL(state, [
      "user:email",
    ]);
    return Response.redirect(authorizationURL, 302);
  }

  // Step 2: exchange the returned code for tokens, then call the API.
  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code");
    if (!code) return new Response("Missing code", { status: 400 });

    const tokens = await github.validateAuthorizationCode(code);
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${tokens.accessToken()}`,
        "user-agent": "deno-arctic-example",
      },
    });
    const user = await userRes.json();
    return new Response(`Signed in as ${user.login}`);
  }

  return new Response("Not found", { status: 404 });
}

Deno.serve(handler);

/**
 * @title HTTP server: Basic authentication
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication} MDN: HTTP authentication
 * @resource {https://jsr.io/@std/crypto/doc/timing-safe-equal} @std/crypto: timingSafeEqual
 * @group Network
 *
 * Basic authentication sends a username and password base64-encoded in the
 * authorization header. It is only safe over HTTPS, but it is simple and
 * still common for internal tools and admin endpoints. This example parses
 * the header and compares credentials in constant time.
 */

import { timingSafeEqual } from "jsr:@std/crypto/timing-safe-equal";

const USERNAME = "admin";
const PASSWORD = "hunter2";

function digest(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

// Comparing SHA-256 digests instead of the raw strings gives timingSafeEqual
// two equal-length inputs, so neither how far the comparison got nor the
// length of the secret leaks through response timing.
async function safeCompare(a: string, b: string): Promise<boolean> {
  return timingSafeEqual(await digest(a), await digest(b));
}

async function authorized(req: Request): Promise<boolean> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  // The value after the scheme is base64 of "username:password".
  let decoded: string;
  try {
    decoded = atob(header.slice("Basic ".length));
  } catch {
    return false;
  }
  const colon = decoded.indexOf(":");
  if (colon === -1) return false;
  const user = decoded.slice(0, colon);
  const pass = decoded.slice(colon + 1);

  // Evaluate both comparisons so a wrong username and a wrong password
  // take the same time.
  const userOk = await safeCompare(user, USERNAME);
  const passOk = await safeCompare(pass, PASSWORD);
  return userOk && passOk;
}

Deno.serve(async (req) => {
  if (!(await authorized(req))) {
    // The www-authenticate header names the scheme and realm. Browsers
    // respond to it by showing a login dialog.
    return new Response("Unauthorized\n", {
      status: 401,
      headers: { "www-authenticate": 'Basic realm="example", charset="UTF-8"' },
    });
  }
  return new Response("Welcome, admin\n");
});

// Without credentials the server challenges the client:
//
//   curl -i http://localhost:8000/
//
//   HTTP/1.1 401 Unauthorized
//   www-authenticate: Basic realm="example", charset="UTF-8"
//   Content-Type: text/plain;charset=UTF-8
//   content-length: 13
//   date: Thu, 11 Jun 2026 18:54:53 GMT
//
//   Unauthorized
//
// curl -u encodes the credentials into the authorization header:
//
//   curl -u admin:hunter2 http://localhost:8000/
//   Welcome, admin

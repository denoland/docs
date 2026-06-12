/**
 * @title HTTP server: Cookies
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://jsr.io/@std/http/doc/cookie} @std/http: cookie
 * @resource {https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies} MDN: Using HTTP cookies
 * @group Network
 *
 * Cookies carry state between requests in the cookie and set-cookie headers.
 * The @std/http/cookie module parses and serializes them with the right
 * attributes. This example sets a session cookie on login, reads it back on
 * later requests, and deletes it on logout.
 */

import { deleteCookie, getCookies, setCookie } from "jsr:@std/http/cookie";

Deno.serve((req) => {
  const url = new URL(req.url);
  // getCookies parses the cookie request header into a plain object.
  const cookies = getCookies(req.headers);

  if (url.pathname === "/login") {
    const headers = new Headers({ "content-type": "text/plain" });
    // setCookie appends a set-cookie header. httpOnly hides the cookie from
    // document.cookie, secure restricts it to HTTPS, and sameSite Lax keeps
    // it off cross-site subrequests. Use all three for session cookies.
    setCookie(headers, {
      name: "session",
      value: crypto.randomUUID(),
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 3600,
      path: "/",
    });
    return new Response("Logged in\n", { headers });
  }

  if (url.pathname === "/logout") {
    const headers = new Headers({ "content-type": "text/plain" });
    // deleteCookie sets the same cookie with an expiry in the past. The
    // path and domain must match the values used when it was set.
    deleteCookie(headers, "session", { path: "/" });
    return new Response("Logged out\n", { headers });
  }

  if (cookies.session) {
    return new Response(`Welcome back, session ${cookies.session}\n`);
  }
  return new Response("No session yet. Visit /login first.\n");
});

// Log in and inspect the set-cookie header:
//
//   curl -i http://localhost:8000/login
//
//   HTTP/1.1 200 OK
//   content-type: text/plain
//   set-cookie: session=b46ba9d6-6f07-435d-a681-67a0fdf240f1; Secure; HttpOnly; Max-Age=3600; SameSite=Lax; Path=/
//   content-length: 10
//   date: Thu, 11 Jun 2026 18:54:45 GMT
//
//   Logged in
//
// Send the cookie back on the next request:
//
//   curl http://localhost:8000/ -H "cookie: session=b46ba9d6-6f07-435d-a681-67a0fdf240f1"
//   Welcome back, session b46ba9d6-6f07-435d-a681-67a0fdf240f1
//
// Logging out overwrites the cookie with one that expires immediately:
//
//   curl -i http://localhost:8000/logout
//
//   HTTP/1.1 200 OK
//   content-type: text/plain
//   set-cookie: session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
//   content-length: 11
//   date: Thu, 11 Jun 2026 18:54:45 GMT
//
//   Logged out

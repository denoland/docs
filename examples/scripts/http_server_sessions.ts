/**
 * @title HTTP server: Sessions
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies} MDN: Using HTTP cookies
 * @resource {/examples/http_server_routing} Example: HTTP server: Routing
 * @group Network
 *
 * A session keeps a user logged in across requests. The browser stores only
 * a random session id in a cookie, and the server maps that id to the actual
 * session data. This example implements login, a protected endpoint, and
 * logout, with sessions that expire after a fixed lifetime.
 */

interface Session {
  username: string;
  expires: number;
}

// Session data lives on the server. The cookie holds nothing but the id, so
// clients cannot read or forge the data itself.
const sessions = new Map<string, Session>();
const TTL_MS = 60 * 60 * 1000;

function getSessionId(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)session=([0-9a-f-]+)/);
  return match ? match[1] : null;
}

function getSession(req: Request): Session | null {
  const id = getSessionId(req);
  if (id === null) return null;
  const session = sessions.get(id);
  if (session === undefined) return null;

  // Expired sessions are pruned lazily, on the first access after their
  // deadline. No background timer is needed.
  if (session.expires < Date.now()) {
    sessions.delete(id);
    return null;
  }
  return session;
}

Deno.serve(async (req) => {
  const { pathname } = new URL(req.url);

  if (req.method === "POST" && pathname === "/login") {
    // A real login checks credentials first. Here any username is accepted.
    const { username } = await req.json();
    const id = crypto.randomUUID();
    sessions.set(id, { username, expires: Date.now() + TTL_MS });

    // httpOnly hides the cookie from client-side JavaScript, which blocks
    // session theft through XSS. Add Secure when serving over HTTPS.
    return new Response("logged in\n", {
      headers: {
        "set-cookie":
          `session=${id}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`,
      },
    });
  }

  if (pathname === "/me") {
    const session = getSession(req);
    if (session === null) {
      return new Response("not logged in\n", { status: 401 });
    }
    return new Response(`hello, ${session.username}\n`);
  }

  if (req.method === "POST" && pathname === "/logout") {
    // Destroy the server-side state and clear the cookie. Deleting the Map
    // entry is what actually ends the session.
    const id = getSessionId(req);
    if (id !== null) sessions.delete(id);
    return new Response("logged out\n", {
      headers: { "set-cookie": "session=; Path=/; Max-Age=0" },
    });
  }

  return new Response("not found\n", { status: 404 });
});

// An in-memory Map only works while a single process serves all traffic.
// For multiple instances or restarts, keep the same cookie scheme but store
// sessions in a shared store such as Deno KV or a database.

// The full flow with curl, using a cookie jar (-c saves cookies, -b sends
// them back):
//
//   curl -s -c /tmp/jar -d '{"username":"ada"}' http://localhost:8000/login
//   logged in
//
//   curl -s -b /tmp/jar http://localhost:8000/me
//   hello, ada
//
//   curl -s -b /tmp/jar -X POST http://localhost:8000/logout
//   logged out
//
//   curl -s -b /tmp/jar http://localhost:8000/me
//   not logged in

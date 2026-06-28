/**
 * @title HTTP server: Signed Cookies
 * @difficulty intermediate
 * @tags http, server, web-crypto
 * @resource {https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies} MDN: Using HTTP cookies
 * @resource {/examples/http_server_cookies} Example: HTTP server: Cookies
 * @group Network
 *
 * Securely sign and verify browser cookies using native cryptographic utilities
 * to prevent client-side tampering. While clients can see the values of signed
 * cookies, they cannot manipulate them without invalidating the cryptographic signature.
 */

import {
  getSignedCookie,
  setSignedCookie,
} from "jsr:@std/http/unstable-signed-cookie";

// Cryptographic keys must be generated using web standard Web Crypto APIs.
const cryptoKey = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"],
);

Deno.serve(async (req) => {
  const { pathname } = new URL(req.url);

  // ROUTE 1: Setting a secure, signed session cookie.
  if (pathname === "/set") {
    const res = new Response(
      "A cryptographically signed cookie has been successfully set!\n",
    );

    // Pass parameters: headers, cookie name, value, secret key, and option flags.
    await setSignedCookie(res.headers, "session_id", "user_abc123", cryptoKey, {
      path: "/",
      httpOnly: true,
    });

    return res;
  }

  // ROUTE 2: Fetching and verifying the incoming signed cookie.
  if (pathname === "/get") {
    // getSignedCookie extracts the cookie and evaluates the signature against our key.
    const cookieValue = await getSignedCookie(
      req.headers,
      "session_id",
      cryptoKey,
    );

    // If the client tampered with the string value, verification fails and returns undefined.
    if (cookieValue === undefined) {
      return new Response(
        "Unauthorized: Cookie is missing or signature verification failed!\n",
        {
          status: 401,
        },
      );
    }

    return new Response(
      `Access Granted. Verified Session Data: ${cookieValue}\n`,
    );
  }

  return new Response("not found\n", { status: 404 });
});

// The full flow with curl, using a cookie jar (-c saves cookies, -b sends
// them back):
//
//   curl -s -c /tmp/jar http://localhost:8000/set
//   A cryptographically signed cookie has been successfully set!
//
//   curl -s -b /tmp/jar http://localhost:8000/get
//   Access Granted. Verified Session Data: user_abc123

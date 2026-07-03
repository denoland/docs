/**
 * @title HTTP server: Signed Cookies
 * @difficulty intermediate
 * @tags cli, deploy
 * @resource {https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies} MDN: Using HTTP cookies
 * @resource {/examples/http_server_cookies} Example: HTTP server: Cookies
 * @group Network
 *
 * Securely sign and verify browser cookies using native cryptographic utilities 
 * to prevent client-side tampering. While clients can see the values of signed 
 * cookies, they cannot manipulate them without invalidating the cryptographic signature.
 */

import { parseSignedCookie, signCookie } from "jsr:@std/http/unstable-signed-cookie";

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
    const rawValue = "user_abc123";
    
    // signCookie securely appends a cryptographic hash signature to the string value.
    const signedValue = await signCookie(rawValue, cryptoKey);

    return new Response("A cryptographically signed cookie has been successfully set!\n", {
      headers: {
        "set-cookie": `session_id=${signedValue}; Path=/; HttpOnly; SameSite=Lax`,
      },
    });
  }

  // ROUTE 2: Fetching and verifying the incoming signed cookie.
  if (pathname === "/get") {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const match = cookieHeader.match(/(?:^|;\s*)session_id=([^;]+)/);
    
    if (!match) {
      return new Response("Unauthorized: Cookie is missing!\n", { status: 401 });
    }

    try {
      // parseSignedCookie extracts and validates the data against our key.
      // If verification fails, it throws an error.
      const verifiedValue = parseSignedCookie(match[1]);
      return new Response(`Access Granted. Verified Session Data: ${verifiedValue}\n`);
    } catch {
      return new Response("Unauthorized: Signature verification failed!\n", { status: 401 });
    }
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
/**
 * @title HTTP server: Verifying webhook signatures
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries} GitHub: Validating webhook deliveries
 * @resource {/examples/hmac_generate_verify} Example: HMAC generation and verification
 * @group Network
 *
 * Webhook senders sign each delivery so receivers can prove the payload
 * came from them and was not tampered with in transit. GitHub, Stripe, and
 * many others use an HMAC of the request body with a shared secret. This
 * server verifies a GitHub style x-hub-signature-256 header before trusting
 * the payload.
 */

// Both sides know this secret. In a real deployment read it from an
// environment variable instead of hardcoding it.
const SECRET = "it-is-a-secret-to-everybody";

// Import the secret once at startup as an HMAC-SHA256 verification key.
const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(SECRET),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["verify"],
);

async function verify(req: Request): Promise<unknown | null> {
  // Read the raw bytes before any JSON parsing. The signature covers the
  // exact bytes that were sent; parsing and re-serializing can change key
  // order and whitespace, which would produce a different HMAC.
  const body = await req.bytes();

  // The header carries the hex digest behind a sha256= prefix.
  const header = req.headers.get("x-hub-signature-256") ?? "";
  if (!header.startsWith("sha256=")) return null;

  let signature: BufferSource;
  try {
    signature = Uint8Array.fromHex(header.slice("sha256=".length));
  } catch {
    return null;
  }

  // crypto.subtle.verify recomputes the HMAC and compares in constant time.
  // Comparing hex strings with === instead would leak how many leading
  // characters matched through response timing.
  const valid = await crypto.subtle.verify("HMAC", key, signature, body);
  if (!valid) return null;

  // Only now is it safe to parse and act on the payload.
  return JSON.parse(new TextDecoder().decode(body));
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("method not allowed\n", { status: 405 });
  }

  const payload = await verify(req);
  if (payload === null) {
    return new Response("invalid signature\n", { status: 401 });
  }

  console.log("verified webhook:", payload);
  return new Response("ok\n");
});

// A sender computes the same HMAC over the body and puts it in the header.
// The HMAC-SHA256 of {"action":"opened"} under the secret above is
// 04c343e56984578880ead1d6feefa1d581c4336c868f87358b81041f23a1a62a.
// Posting that exact body with that signature succeeds, and any change to
// the body makes the same signature fail:
//
//   curl -s -d '{"action":"opened"}' \
//     -H "x-hub-signature-256: sha256=04c343e56984578880ead1d6feefa1d581c4336c868f87358b81041f23a1a62a" \
//     http://localhost:8000/
//   ok
//
//   curl -s -d '{"action":"deleted"}' \
//     -H "x-hub-signature-256: sha256=04c343e56984578880ead1d6feefa1d581c4336c868f87358b81041f23a1a62a" \
//     http://localhost:8000/
//   invalid signature

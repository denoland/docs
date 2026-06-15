/**
 * @title Sign and verify data with ECDSA
 * @difficulty intermediate
 * @tags cli, deploy
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign} MDN: SubtleCrypto.sign
 * @resource {https://docs.deno.com/api/web/~/SubtleCrypto} Doc: crypto.subtle
 * @group Cryptography
 *
 * A digital signature proves that a message was produced by the holder of a
 * private key and was not modified in transit. Anyone with the matching
 * public key can check the signature, but only the private key can create
 * it. This example uses ECDSA on the P-256 curve from the built-in Web
 * Crypto API.
 */

// Generate an ECDSA key pair on the P-256 curve. The private key signs,
// the public key verifies.
const { privateKey, publicKey } = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["sign", "verify"],
);

// Sign a message. ECDSA hashes the data first, here with SHA-256, and the
// signature changes on every run because ECDSA mixes in a random nonce.
const message = new TextEncoder().encode("release v2.0.0");
const signature = await crypto.subtle.sign(
  { name: "ECDSA", hash: "SHA-256" },
  privateKey,
  message,
);
console.log(new Uint8Array(signature).toHex()); // e.g. 989b58f4b154...

// Verify the signature against the original message with the public key.
const valid = await crypto.subtle.verify(
  { name: "ECDSA", hash: "SHA-256" },
  publicKey,
  signature,
  message,
);
console.log(valid); // true

// A tampered message fails verification, even for a one character change.
const tampered = new TextEncoder().encode("release v2.0.1");
console.log(
  await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    publicKey,
    signature,
    tampered,
  ),
); // false

// Export the public key as JWK to share it with whoever needs to verify
// your signatures. The x and y fields hold the public curve point; a
// private key JWK would also carry the secret d field, so never share that.
const jwk = await crypto.subtle.exportKey("jwk", publicKey);
console.log(jwk.kty); // EC
console.log(jwk.crv); // P-256

// The receiving side imports the JWK and gets a key usable for verify.
const imported = await crypto.subtle.importKey(
  "jwk",
  jwk,
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["verify"],
);
console.log(
  await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    imported,
    signature,
    message,
  ),
); // true

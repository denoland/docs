/**
 * @title HMAC Generation and Verification
 * @difficulty intermediate
 * @tags cli, web
 * @run <url>
 * @group Cryptography
 *
 * This example demonstrates how to generate and verify an HMAC (Hash-based Message Authentication Code)
 * using Deno's built-in SubtleCrypto API with the SHA-256 hash function.
 */

// Define the secret key for HMAC (in a real application, store this securely)
const secret = "supersecretkey";

// Convert the secret key to a Uint8Array using TextEncoder
const encoder = new TextEncoder();
const keyData = encoder.encode(secret);

// Import the secret key into the SubtleCrypto API for HMAC operations
const key = await crypto.subtle.importKey(
  "raw", // The format of the key
  keyData, // The key data
  { // Algorithm details
    name: "HMAC",
    hash: { name: "SHA-256" },
  },
  false, // Whether the key is extractable
  ["sign", "verify"], // Key usages: Sign and Verify
);

// The message to be authenticated
const message = "Authenticate this message";

// Convert the message to a Uint8Array
const messageData = encoder.encode(message);

// Generate the HMAC signature for the message
const signature = await crypto.subtle.sign("HMAC", key, messageData);

// Function to convert ArrayBuffer to hex string for readability only. This isn't part of the generation or verification
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Output the generated HMAC signature in hexadecimal format
console.log("Generated HMAC:", bufferToHex(signature));

// Verify the HMAC signature
const isValid = await crypto.subtle.verify("HMAC", key, signature, messageData);

// Output the verification result
console.log("Is the HMAC valid?", isValid);

/**
 * @title Creating and verifying JWT
 * @difficulty intermediate
 * @tags cli, deploy
 * @run <url>
 * @resource {https://deno.land/x/jose} Doc: jose library for Deno
 * @group Authentication
 *
 * This example demonstrates how to create and verify a JSON Web Token (JWT)
 * using the `jose` library in Deno. JWTs are often used for secure
 * communication between a client and server, enabling stateless
 * authentication. This script includes functions to generate and verify
 * tokens using the HS256 algorithm.
 */

// Import necessary functions and types from the `jose` library.
import {
  JWTPayload,
  jwtVerify,
  SignJWT,
} from "https://deno.land/x/jose@v5.9.4/index.ts";

// Define a secret key used for signing and verifying JWTs. Ensure that this secret is kept secure in a real-world application.
const secret = new TextEncoder().encode("secret-that-no-one-knows");

// Creates a JSON Web Token (JWT) with a specified payload and signed using the HS256 algorithm and has a 1-hour expiration time.
async function createJWT(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return jwt;
}

// Verifies a given JSON Web Token (JWT) using the secret key. If valid, returns the payload data contained in the JWT else logs the error and returns null.
async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    // Verify the JWT using the secret key and extract the payload.
    const { payload } = await jwtVerify(token, secret);
    console.log("JWT is valid:", payload);
    return payload;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}

(async () => {
  // Creating a JWT with user-specific information.
  const token = await createJWT({ userId: 123, username: "john_doe" });
  console.log("Created JWT:", token);

  // Verifying the generated JWT to ensure it has not been tampered with.
  const verifiedPayload = await verifyJWT(token);
  console.log("Verified Payload:", verifiedPayload);
})();

/**
 * @title Derive encryption keys from passwords
 * @difficulty intermediate
 * @tags cli, deploy
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey} MDN: SubtleCrypto.deriveKey
 * @resource {/examples/hash_password/} Example: Hashing and verifying passwords
 * @group Cryptography
 *
 * A password is not an encryption key: it is short, low entropy, and the
 * wrong size for AES. PBKDF2 stretches a password and a salt into a proper
 * 256 bit key. This example derives an AES-GCM key from a password with
 * the built-in Web Crypto API and uses it to encrypt and decrypt data.
 */

// The OWASP recommended cost for PBKDF2 with SHA-256.
const ITERATIONS = 600_000;

// Derive an AES-GCM key from a password and a salt. This differs from
// password storage, where you keep only a digest to compare against; here
// the derived key is used directly to encrypt and is never stored.
async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// Encrypt with a random salt and a random IV. Neither is a secret, but the
// IV must never repeat for the same key, and both are needed again to
// decrypt, so ship them alongside the ciphertext.
async function encrypt(password: string, plaintext: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  return { salt, iv, ciphertext };
}

// Decrypt by re-deriving the same key from the password and stored salt.
async function decrypt(
  password: string,
  { salt, iv, ciphertext }: Awaited<ReturnType<typeof encrypt>>,
): Promise<string> {
  const key = await deriveKey(password, salt);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
  return new TextDecoder().decode(plaintext);
}

// Round trip: encrypt with a password, decrypt with the same password.
const encrypted = await encrypt("correct horse battery staple", "top secret");
console.log(new Uint8Array(encrypted.ciphertext).toBase64()); // e.g. nD0OJq+JqHEm...
console.log(await decrypt("correct horse battery staple", encrypted)); // top secret

// A wrong password derives a different key, and AES-GCM authenticates the
// ciphertext, so decryption rejects it instead of returning garbage.
try {
  await decrypt("wrong password", encrypted);
} catch (error) {
  console.log((error as Error).name); // OperationError
}

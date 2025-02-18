/**
 * @title ECDH Drive Key
 * @difficulty intermediate
 * @tags cli, web
 * @run <url>
 * @group Cryptography
 *
 * This example demonstrates how to derive a shared secret key using the Elliptic Curve Diffie-Hellman (ECDH) algorithm.
 */

const data = "Hello, Deno 2.0!";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Derive symmetric keys from ECDH key pairs
async function driveSymmetricKey(
  privateKey: CryptoKey,
  publicKey: CryptoKey,
): Promise<CryptoKey> {
  return await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );
}

// Encrypt and decrypt messages using AES-GCM
async function encryptMessage(
  key: CryptoKey,
  iv: Uint8Array,
  data: Uint8Array,
): Promise<ArrayBuffer> {
  const dataBuffer = encoder.encode(data);
  return await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    dataBuffer,
  );
}

async function decryptMessage(
  key: CryptoKey,
  iv: Uint8Array,
  data: ArrayBuffer,
): Promise<ArrayBuffer> {
  return await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data,
  );
}

// Get a human-readable string
async function getBase64Key(key: CryptoKey): Promise<string> {
  const buffer = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

// Generate an ECDH key pair for Alice
const AliceKey = await crypto.subtle.generateKey(
  {
    name: "ECDH",
    namedCurve: "P-256", // Use the NIST P-256 curve, or P-384 or P-521
  },
  true,
  ["deriveKey"],
);
// Generate an ECDH key pair for Bob
const BobKey = await crypto.subtle.generateKey(
  {
    name: "ECDH",
    namedCurve: "P-256", // Use the NIST P-256 curve, or P-384 or P-521
  },
  true,
  ["deriveKey"],
);
// Drive symmetric keys for Alice
const AliceSymmetricKey = await driveSymmetricKey(
  AliceKey.privateKey,
  BobKey.publicKey,
);

// Output the derived symmetric key for Alice
console.log("Alice's symmetric key:", await getBase64Key(AliceSymmetricKey));

// Drive symmetric keys for Bob
const BobSymmetricKey = await driveSymmetricKey(
  BobKey.privateKey,
  AliceKey.publicKey,
);

// Output the derived symmetric key for Bob
console.log("Bob's symmetric key:", await getBase64Key(BobSymmetricKey));

// Generate a random initialization vector (IV) for AES-GCM
// The IV must be unique for each encryption operation but doesn't need to be secret. The IV length for AES-GCM is typically 12 bytes.
const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV for AES-GCM

// Encrypt and decrypt a message using the derived symmetric keys
const dataBuffer = encoder.encode(data);
const encryptedData = await encryptMessage(AliceSymmetricKey, iv, dataBuffer);
console.log("Encrypted Data:", new Uint8Array(encryptedData));

const decryptedData = await decryptMessage(BobSymmetricKey, iv, encryptedData);
const decryptedMessage = decoder.decode(decryptedData);
console.log("Verification of Decrypted Message:", decryptedMessage === data);
console.log("Verification of Decrypted Message:", decryptedMessage === data);

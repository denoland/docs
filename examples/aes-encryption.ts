/**
 * @title AES Encryption and Decryption
 * @difficulty intermediate
 * @tags cli, web
 * @run <url>
 * @group Cryptography
 *
 * This example demonstrates AES encryption and decryption using Deno's built-in SubtleCrypto API.
 */

// Define the text to be encrypted
const text = "Hello, Deno 2.0!";

// Convert the text to a Uint8Array using TextEncoder (required for encryption)
const encoder = new TextEncoder();
const data = encoder.encode(text);

// Generate an AES-GCM key for encryption and decryption
// We used AES-GCM in this example as it is a widely used encryption mode, but you can also use modes like AES-CBC or AES-CTR for different use cases.
const key = await crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256, // 256-bit encryption key for strong security
  },
  true, // The key is extractable for encryption and decryption
  ["encrypt", "decrypt"], // Key usages: encryption and decryption
);

// Generate a random initialization vector (IV) for AES-GCM
// The IV must be unique for each encryption operation but doesn't need to be secret.
const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV for AES-GCM

// Encrypt the text using AES-GCM
const encryptedData = await crypto.subtle.encrypt(
  {
    name: "AES-GCM",
    iv: iv, // Initialization vector must be unique for each encryption
  },
  key, // The generated key
  data, // The text data to encrypt
);

console.log("Encrypted Data:", new Uint8Array(encryptedData)); // Log the encrypted result as a byte array

// Decrypt the encrypted data back to plaintext using the same IV and key. The IV and Key used for decryption must the same as used for encryption
const decryptedData = await crypto.subtle.decrypt(
  {
    name: "AES-GCM",
    iv: iv, // Same IV used for encryption
  },
  key, // The same key used for encryption
  encryptedData, // The encrypted data to decrypt
);

// Convert the decrypted data back to a string using TextDecoder
const decryptedText = new TextDecoder().decode(decryptedData);
console.log("Decrypted Text:", decryptedText);

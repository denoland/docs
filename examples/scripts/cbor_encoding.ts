/**
 * @title Encode and decode CBOR
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://jsr.io/@std/cbor} Doc: @std/cbor
 * @resource {https://www.rfc-editor.org/rfc/rfc8949} Spec: CBOR (RFC 8949)
 * @group Encoding
 *
 * CBOR is a binary serialization format standardized as RFC 8949. It backs
 * WebAuthn, IoT protocols and many other systems that need compact
 * self-describing messages. Unlike JSON it has native support for binary
 * data and dates. The Standard Library implements it in jsr:@std/cbor.
 */
import { decodeCbor, encodeCbor } from "jsr:@std/cbor";

// The value contains a Uint8Array and a Date. Neither would survive
// JSON.stringify, which has no representation for them.
const value = {
  name: "Deno",
  version: 2,
  active: true,
  signature: new Uint8Array([222, 173, 190, 239]),
  released: new Date("2020-05-13T00:00:00Z"),
};

// To encode, pass the value to the encodeCbor function. The result is a
// Uint8Array.
const bytes = encodeCbor(value);
console.log(bytes.length); // 58

// To decode, pass the bytes to the decodeCbor function. It returns the
// broad CborType, so cast the result to the shape you expect.
const decoded = decodeCbor(bytes) as typeof value;

// The binary payload and the date both come back as their real types.
console.log(decoded.signature); // Uint8Array(4) [ 222, 173, 190, 239 ]
console.log(decoded.released instanceof Date); // true
console.log(decoded.released.toISOString()); // 2020-05-13T00:00:00.000Z

// CBOR is also more compact than JSON text. For this small object the
// encoding saves about a third of the bytes.
const small = { name: "Deno", version: 2, active: true };
console.log(JSON.stringify(small).length); // 41
console.log(encodeCbor(small).length); // 28

// Supported value types are undefined, null, boolean, number, bigint,
// string, Uint8Array, Date, arrays and plain objects of those, plus
// CborTag for the remaining tagged values from the specification.

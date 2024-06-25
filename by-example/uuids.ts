/**
 * @title Generating & Validating UUIDs
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID} MDN: crypto.randomUUID
 * @resource {$std/uuid/mod.ts} Doc: std/uuid
 * @group Cryptography
 *
 * UUIDs (universally unique identifier) can be used to uniquely identify some
 * object or data.
 */

// A random UUID can be generated using the builtin Web Cryptography API. This
// type of UUID is also known as UUID v4.
const myUUID = crypto.randomUUID();
console.log("Random UUID:", myUUID);

// The standard library contains some more functions for working with UUIDs.
import * as uuid from "jsr:@std/uuid";

// You can validate that a given string is a valid UUID.
console.log(uuid.validate("not a UUID")); // false
console.log(uuid.validate("6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b")); // true

// You can also generate a time-based (v1) UUID. By default this uses system
// time as the time source.
console.log(uuid.v1.generate());

// SHA-1 namespaced (v5) UUIDs can also be generated. For this you need
// to specify a namespace and data:
const NAMESPACE_URL = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const data = new TextEncoder().encode("deno.land");
console.log(await uuid.v5.generate(NAMESPACE_URL, data));

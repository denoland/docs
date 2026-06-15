/**
 * @title Encode and decode MessagePack
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://jsr.io/@std/msgpack} Doc: @std/msgpack
 * @resource {https://msgpack.org} Spec: MessagePack
 * @group Encoding
 *
 * MessagePack is a binary serialization format with the same data model as
 * JSON. The binary encoding is smaller and faster to parse, which makes it
 * a good fit for caches, message queues and service to service traffic.
 * The Standard Library implements it in jsr:@std/msgpack.
 */
import { decode, encode } from "jsr:@std/msgpack";

// We encode a value that could just as well be JSON.
const value = {
  name: "Deno",
  version: 2,
  tags: ["fast", "secure"],
  active: true,
  score: 99.5,
};

// To encode, pass the value to the encode function. The result is a
// Uint8Array, noticeably smaller than the JSON text of the same value.
const bytes = encode(value);
console.log(bytes.length); // 61
console.log(JSON.stringify(value).length); // 79

// To decode, pass the bytes to the decode function. The round trip
// returns an equivalent value.
const decoded = decode(bytes);
console.log(decoded);
//- {
//-   name: "Deno",
//-   version: 2,
//-   tags: [ "fast", "secure" ],
//-   active: true,
//-   score: 99.5
//- }

// MessagePack supports two types that JSON lacks: raw binary data and
// bigint. Both survive the round trip without any base64 tricks.
const binary = decode(encode({ data: new Uint8Array([1, 2, 3]), big: 123n }));
console.log(binary); // { data: Uint8Array(3) [ 1, 2, 3 ], big: 123n }

// The full set of supported value types is null, boolean, number, bigint,
// string, Uint8Array, and arrays and plain objects of those. Anything
// else, for example a Date or a Map, makes encode throw an error.

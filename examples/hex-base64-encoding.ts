/**
 * @title Hex and base64 encoding
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @group Encoding
 *
 * There are a few cases where it would be practical to encode
 * and decode between different string and array buffer formats.
 * The Deno standard library makes this easy.
 */

// The standard library provides hex and base64 encoding and decoding utilities
import * as base64 from "jsr:@std/encoding/base64";
import * as hex from "jsr:@std/encoding/hex";

// We can easily encode a string or an array buffer into base64 using the base64.encode method.
const base64Encoded = base64.encode("somestringtoencode");
console.log(base64.encode(new Uint8Array([1, 32, 67, 120, 19])));

// We can then decode base64 into a byte array using the decode method.
const base64Decoded = base64.decode(base64Encoded);

// If we want to get the value as a string we can use the built-in TextDecoder.
// We will use these a lot so we can store them in variables to reuse them.
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
console.log(textDecoder.decode(base64Decoded));

// To encode hex, we always use array buffers.
// To use a string as an input we can encode our text.
const arrayBuffer = textEncoder.encode("somestringtoencode");
const hexEncoded = hex.encode(arrayBuffer);
console.log(hexEncoded);

// To read our hex values as a string, we can decode the buffer.
console.log(textDecoder.decode(hexEncoded));

// We can convert back to a string by using the decode method.
const hexDecoded = hex.decode(hexEncoded);
console.log(textDecoder.decode(hexDecoded));

/**
 * @title Hex and base64 encoding
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @group Encoding
 *
 * There are a few cases where it would be practical to encode
 * and decode between different string and array buffer formats.
 * The Deno Standard Library makes this easy.
 */

// The standard library provides hex and base64 encoding and decoding utilities
import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";
import { decodeHex, encodeHex } from "jsr:@std/encoding/hex";

// We can easily encode a string or an array buffer into base64 using the encodeBase64 method.
const base64Encoded = encodeBase64("somestringtoencode");
console.log(encodeBase64(new Uint8Array([1, 32, 67, 120, 19])));

// We can then decode base64 into a Uint8Array using the decode method.
const base64Decoded = decodeBase64(base64Encoded);

// If we want to get the value as a string we can use the built-in TextDecoder.
const textDecoder = new TextDecoder();
console.log(textDecoder.decode(base64Decoded));

// To encode hex, we can use the encodeHex method.
const hexEncoded = encodeHex("somestringtoencode");
console.log(hexEncoded);

// We can convert back to a string by using the decodeHex method.
const hexDecoded = decodeHex(hexEncoded);
console.log(textDecoder.decode(hexDecoded));

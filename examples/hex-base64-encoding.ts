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
  GNU nano 8.2                                                                                                                              b.js                                                                                                                                          
import * as encodeBase64 from "jsr:@std/encoding/base64";
import * as hex from "jsr:@std/encoding/hex";

const base64Encoded = encodeBase64("somestringtoencode");
console.log(encodeBase64(new Uint8Array([1, 32, 67, 120, 19])));

const base64Decoded = decodeBase64.decode(base64Encoded);

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
console.log(textDecoder.decode(base64Decoded));

const arrayBuffer = textEncoder.encode("somestringtoencode");
const hexEncoded = hex.encode(arrayBuffer);
console.log(hexEncoded);

console.log(textDecoder.decode(hexEncoded));

const hexDecoded = hex.decode(hexEncoded);
console.log(textDecoder.decode(hexDecoded));

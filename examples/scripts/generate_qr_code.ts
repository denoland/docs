/**
 * @title Generate a QR code
 * @difficulty beginner
 * @tags cli, deploy
 * @run -W <url>
 * @resource {https://jsr.io/@libs/qrcode} @libs/qrcode on JSR
 * @group Web frameworks and libraries
 *
 * A QR code encodes a short piece of text, usually a URL, as a scannable
 * image. The @libs/qrcode module on JSR generates them with no native
 * dependencies, returning an SVG string, a data array, or terminal output.
 */
import { qrcode } from "jsr:@libs/qrcode";

// The default output is an SVG string, ready to embed in a page or write
// to a file. SVG scales to any size without blurring, which suits print
// and high-resolution screens.
const svg = qrcode("https://deno.com", { output: "svg" });
await Deno.writeTextFile("deno-qr.svg", svg);
console.log(svg.startsWith("<?xml")); // true

// The error-correction level trades data capacity for resilience: a higher
// level still scans when part of the code is damaged or covered, at the
// cost of a denser image. Levels are LOW, MEDIUM, QUARTILE, and HIGH.
const robust = qrcode("https://deno.com", {
  output: "svg",
  ecl: "HIGH",
});
console.log(robust.length > svg.length); // true

// Without an output option you get the raw module matrix: a 2D array of
// booleans where true is a dark cell. Use it to render the code yourself,
// for example onto a canvas or into another image format.
const matrix = qrcode("https://deno.com");
console.log(`${matrix.length}x${matrix[0].length} grid`); // 29x29 grid

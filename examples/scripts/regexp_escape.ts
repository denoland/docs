/**
 * @title Escape text for regular expressions
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/regexp/doc/~/escape} Doc: @std/regexp escape
 * @resource {https://jsr.io/@std/regexp} Doc: @std/regexp
 * @group Standard library
 *
 * Building a RegExp from user input is dangerous, because characters
 * like parentheses and dots have special meaning in patterns. A stray
 * "(" throws a syntax error, and an unescaped "." matches more than
 * intended. The escape function neutralizes every special character so
 * the input matches literally.
 */

// A user types this into a search box. The "(" starts a regex group
// that is never closed, so constructing a RegExp from it throws.
const userInput = "find(";

try {
  new RegExp(userInput);
} catch (err) {
  console.log((err as Error).message); // Invalid regular expression: /find(/: Unterminated group
}

// Escaping the input first makes construction safe and the match
// literal.
import { escape } from "jsr:@std/regexp";

const safe = new RegExp(escape(userInput), "g");
console.log(safe.test("call to find( in line 3")); // true

// Escaping matters even when the pattern compiles. An unescaped dot
// matches any character, so "3.1" would also match "321".
console.log(new RegExp("3.1").test("321")); // true
console.log(new RegExp(escape("3.1")).test("321")); // false

// A practical use is highlighting search hits in text. The query is
// escaped, wrapped in a group, and every match gets marked up.
const query = "rate (%)";
const text = "Set the rate (%) field, then save the rate (%) value.";

const highlighted = text.replaceAll(new RegExp(escape(query), "g"), "[$&]");
console.log(highlighted); // Set the [rate (%)] field, then save the [rate (%)] value.

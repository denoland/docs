/**
 * @title Escape an HTML string
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/html/doc/~/escape} Doc: @std/html escape
 * @resource {https://owasp.org/www-community/attacks/xss/} OWASP: Cross Site Scripting
 * @group Web Standard APIs
 *
 * Interpolating user input into HTML without escaping it opens the door to
 * cross-site scripting. The standard library escapes the five significant
 * characters for you. This example shows escaping and unescaping.
 */
import { escape, unescape } from "jsr:@std/html/entities";

// Escape replaces the characters that carry meaning in HTML with their
// entity equivalents.
const userInput = `<img src=x onerror="alert('pwned')">`;
const escaped = escape(userInput);
console.log(escaped); // &lt;img src=x onerror=&quot;alert(&#39;pwned&#39;)&quot;&gt;

// The escaped string is safe to interpolate into markup as text content or
// a quoted attribute value.
const html = `<p>You said: ${escaped}</p>`;
console.log(html.startsWith("<p>You said: &lt;img")); // true

// Unescape reverses the transformation, including named entities.
console.log(unescape(escaped)); // <img src=x onerror="alert('pwned')">

// Escaping is for HTML text and attributes only. URLs, CSS, and script
// contexts each need their own encoding, and a templating engine or
// framework usually handles all of them for you.

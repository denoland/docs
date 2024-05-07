/**
 * @title Logging with colors
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/console#styling_console_output} MDN: Styling console output
 * @group Basics
 *
 * Most modern terminals can display program logs in colors and with text
 * decorations. This example shows how to display colors when using
 * `console.log`.
 */

// Deno has support for CSS using the %c syntax in console.log. Here, the text
// "Hello World" is displayed in red. This also works in the browser.
console.log("%cHello World", "color: red");

// Not just foreground, but also background colors can be set.
console.log("%cHello World", "background-color: blue");

// Text decorations like underline and strikethrough can be set too.
console.log("%cHello World", "text-decoration: underline");
console.log("%cHello World", "text-decoration: line-through");

// Font weight can also be set (either to normal, or to bold).
console.log("%cHello World", "font-weight: bold");

// Multiple CSS rules can also be applied at once. Here the text is red and bold.
console.log("%cHello World", "color: red; font-weight: bold");

// A single console.log can also contain multiple %c values. Styling is reset at
// every %c.
console.log("%cHello %cWorld", "color: red", "color: blue");

// Instead of predefined colors, hex literals and `rgb()` are also supported.
// Note that some terminals do not support displaying these colors.
console.log("%cHello World", "color: #FFC0CB");
console.log("%cHello World", "color: rgb(255, 192, 203)");

// It is not possible to configure font size, font family, leading, or any other
// CSS attributes.

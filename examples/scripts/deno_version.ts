/**
 * @title Getting the Deno version
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.version} Doc: Deno.version
 * @group CLI
 *
 * How to examine the version of Deno being used.
 */

// To print the current version of Deno, just reach into the Deno global object
// where all non-web-standard APIs reside.
console.log("Current Deno version", Deno.version.deno);

// Deno has two main dependencies: the V8 JavaScript engine (from the Chrome web
// browser) and the TypeScript compiler. The versions of these are also
// accessible in the `Deno.version` object.
console.log("Current TypeScript version", Deno.version.typescript);
console.log("Current V8 version", Deno.version.v8);

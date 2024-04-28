/**
 * @title Importing JSON
 * @difficulty beginner
 * @tags cli, web
 * @run <url>
 *
 * JSON files can be imported in JS and TS files using the `import` keyword.
 * This makes including static data in a library much easier.
 */

// File: ./main.ts

// JSON files can be imported in JS and TS modules. When doing so, you need to
// specify the "json" import assertion type.
import file from "./version.json" with { type: "json" };
console.log(file.version);

// Dynamic imports are also supported.
const module = await import("./version.json", {
  with: { type: "json" },
});
console.log(module.default.version);

/* File: ./version.json
{
  "version": "1.0.0"
}
*/

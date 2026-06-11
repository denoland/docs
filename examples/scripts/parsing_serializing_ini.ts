/**
 * @title Parsing and serializing INI
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://jsr.io/@std/ini} Doc: @std/ini
 * @resource {https://en.wikipedia.org/wiki/INI_file} Wikipedia: INI file
 * @group Encoding
 *
 * INI is a plain text configuration format built from key value pairs that
 * can be grouped into sections. Many tools still read and write it, from
 * git config to legacy application settings. The Standard Library provides
 * parse and stringify functions for it in jsr:@std/ini.
 */
import { parse, stringify } from "jsr:@std/ini";

// An INI document is a list of key=value lines. A name in square brackets
// starts a section and the lines below it belong to that section.
const text = `
theme=dark
port=8080

[server]
host=localhost
debug=true
`;

// To parse, pass the text to the parse function. Top level keys become
// properties and each section becomes a nested object.
const config = parse(text);
console.log(config.theme); // dark
console.log(config.server); // { host: "localhost", debug: "true" }

// INI has no type system, so every value comes back as a string. The port
// looks like a number in the file but it is not one here.
console.log(typeof config.port); // string

// To get typed values, pass a reviver function. It runs for every entry
// and receives the key, the raw value and the section name, and whatever
// it returns ends up in the result.
const typed = parse(text, {
  reviver(_key, value, _section) {
    if (value === "true") return true;
    if (value === "false") return false;
    const num = Number(value);
    return Number.isNaN(num) ? value : num;
  },
});
console.log(typed.port); // 8080
console.log(typed.server); // { host: "localhost", debug: true }

// To serialize, pass an object to the stringify function. Nested objects
// turn back into sections, and numbers and booleans are written as their
// plain text form.
const ini = stringify({
  theme: "dark",
  port: 8080,
  server: { host: "localhost", debug: true },
});
console.log(ini);
//- theme=dark
//- port=8080
//- [server]
//- host=localhost
//- debug=true

/**
 * @title Parsing and serializing TOML
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {/examples/import_export} Example: Importing & Exporting
 * @resource {https://toml.io} Spec: TOML
 * @group Encoding
 *
 * TOML is a widely used configuration language designed to be feature-rich and intuitive to write.
 */
import { parse, stringify } from "jsr:@std/toml";

// To parse a TOML string, you can use the the standard library's TOML
// parse function. The value is returned as a JavaScript object.
const text = `
int = 1_000_000
bool = true

[[bin]]
name = "deno"
path = "cli/main.rs"

[[bin]]
name = "deno_core"
path = "src/foo.rs"
`;
const data = parse(text);
console.log(data.int);
console.log(data.bin.length);

// To turn a JavaScript object into a TOML string, you can use the standard
// library's TOML stringify function.
const obj = {
  ping: "pong",
  complex: [
    { name: "bob", age: 10 },
    { name: "alice", age: 12 },
  ],
};
const toml = stringify(obj);
console.log(toml);
//- ping = "pong"
//-
//- [[complex]]
//- name = "bob"
//- age = 10
//-
//- [[complex]]
//- name = "alice"
//- age = 12

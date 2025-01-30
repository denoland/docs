/**
 * @title Importing & exporting
 * @difficulty beginner
 * @tags cli, deploy
 * @resource {/examples/dependency-management} Example: Dependency Management
 * @resource {https://docs.deno.com/runtime/manual/basics/modules} Manual: Modules
 * @group Basics
 *
 * To build composable programs, it is necessary to be able to import and export
 * functions from other modules. This is accomplished by using ECMA script
 * modules in Deno.
 */

// File: ./util.ts

// To export a function, you use the export keyword.
export function sayHello(thing: string) {
  console.log(`Hello, ${thing}!`);
}

// You can also export types, variables, and classes.
// deno-lint-ignore no-empty-interface
export interface Foo {}
export class Bar {}
export const baz = "baz";

// File: ./main.ts

// To import things from files other files can use the import keyword.
import { sayHello } from "./util.ts";
sayHello("World");

// You can also import all exports from a file.
import * as util from "./util.ts";
util.sayHello("World");

// Imports don't have to be relative, they can also reference 
// absolute file, npm, or [JSR](https://jsr.io) URLs.
import { camelCase } from "jsr:@luca/cases@1";
console.log(camelCase("hello world")); // helloWorld

import OpenAI from "jsr:@openai/openai"
const client = new OpenAI();

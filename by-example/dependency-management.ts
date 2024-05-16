/**
 * @title Dependency Management
 * @difficulty beginner
 * @tags cli, deploy
 * @resource {/import-export} Example: Importing & Exporting
 * @run <url>
 * @group Basics
 *
 * It is unwieldy to have to import the same remote module over and over again.
 * Deno provides some conventions to make managing dependencies easier.
 */

// File: ./deps.ts

// The Deno ecosystem has a convention to re-export all remote dependencies from
// a deps.ts file at the root of the repo. This keeps remote dependencies
// organized, and in a single place.
export * as http from "jsr:@std/http";
export * as path from "jsr:@std/path";

// File: ./main.ts

// Other files can then import dependencies from the deps.ts file.
// deno-lint-ignore no-unused-vars
import { path } from "./deps.ts";

// Doing this makes package version upgrades really easy, as all external
// dependency specifiers live in the same file.

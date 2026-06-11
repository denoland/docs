/**
 * @title Parse and format dates
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/datetime/doc/~/format} Doc: @std/datetime format
 * @resource {https://jsr.io/@std/datetime/doc/~/parse} Doc: @std/datetime parse
 * @resource {https://docs.deno.com/examples/temporal/} Example: Temporal API
 * @group Standard library
 *
 * The @std/datetime package formats and parses plain Date objects with
 * pattern strings like yyyy-MM-dd, and computes human friendly
 * differences between two dates. For richer needs such as time zones
 * and calendar arithmetic, the Temporal API is the modern option.
 */

import { difference, format, parse } from "jsr:@std/datetime";

// Format renders a Date with a pattern string. The timeZone option
// pins the output to UTC so it does not depend on the local zone.
const launch = new Date(Date.UTC(2026, 5, 11, 14, 30));

console.log(format(launch, "yyyy-MM-dd HH:mm", { timeZone: "UTC" })); // 2026-06-11 14:30
console.log(format(launch, "MM/dd/yyyy", { timeZone: "UTC" })); // 06/11/2026
console.log(format(launch, "hh:mm a", { timeZone: "UTC" })); // 02:30 PM

// Parse is the reverse: it reads a string with the same pattern syntax
// and returns a Date in the local time zone.
const parsed = parse("2026-06-11 14:30", "yyyy-MM-dd HH:mm");
console.log(parsed instanceof Date); // true
console.log(parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate()); // 2026 6 11

// Difference reports the gap between two dates in several units at
// once, which is handy for human readable deltas.
const start = new Date(Date.UTC(2025, 0, 1));
const end = new Date(Date.UTC(2026, 5, 11));

const delta = difference(start, end, { units: ["days", "months", "years"] });
console.log(delta); // { days: 526, months: 17, years: 1 }

// These helpers all operate on the built-in Date type. When you need
// time zone aware arithmetic or exact calendar math, reach for the
// Temporal API linked in the resources above.

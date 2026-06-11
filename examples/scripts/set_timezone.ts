/**
 * @title Set the time zone
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat} MDN: Intl.DateTimeFormat
 * @resource {/examples/temporal/} Example: Temporal API
 * @group System
 *
 * Date, Intl, and Temporal all format times in the process time zone,
 * which defaults to the operating system setting. The TZ environment
 * variable overrides it, which makes time-dependent behavior reproducible.
 */

// The current time zone is visible through the Intl API.
const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(zone); // Europe/Warsaw (or whatever the OS is set to)

// Everything that formats local time follows it.
console.log(new Date().toString());

// Start the process with TZ set to pin the zone, for example to keep
// timestamps in CI logs consistent or to reproduce a user's bug report:
//
//   TZ=Asia/Tokyo deno run main.ts
//   Asia/Tokyo
//   Thu Jun 11 2026 22:15:00 GMT+0900 (Japan Standard Time)
//
//   TZ=UTC deno run main.ts
//   UTC

// To format a single value in another zone without changing the process
// zone, pass timeZone to Intl instead.
const tokyo = new Intl.DateTimeFormat("en-US", {
  timeStyle: "long",
  timeZone: "Asia/Tokyo",
}).format(new Date());
console.log(tokyo);

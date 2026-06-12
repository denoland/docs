/**
 * @title Parse and format dates
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://docs.deno.com/api/web/~/Temporal} Doc: Temporal
 * @resource {/examples/temporal/} Example: Temporal API
 * @group Web Standard APIs
 *
 * Everyday date work is parsing a value, formatting it for people, and
 * doing arithmetic on it. The built-in Temporal API covers all three with
 * explicit types for dates, times, and datetimes. This example walks the
 * common tasks.
 */

// Parse an ISO 8601 string into a plain calendar date. The from method
// validates as it parses.
const date = Temporal.PlainDate.from("2026-06-12");
console.log(date.toString()); // 2026-06-12

// With overflow reject, impossible dates throw instead of clamping.
try {
  Temporal.PlainDate.from("2026-02-30", { overflow: "reject" });
} catch {
  console.log("2026-02-30 is not a real date");
}

// Datetimes parse the same way, and toLocaleString formats them for
// people using the Intl machinery.
const meeting = Temporal.PlainDateTime.from("2026-06-12T09:30:00");
console.log(meeting.toLocaleString("en-US", {
  dateStyle: "long",
  timeStyle: "short",
})); // June 12, 2026 at 9:30 AM

// Date arithmetic is explicit about units, and the calendar handles month
// lengths and leap years.
console.log(date.add({ weeks: 2 }).toString()); // 2026-06-26

// until produces the duration between two dates; total converts it to a
// single unit.
const release = Temporal.PlainDate.from("2026-09-01");
const days = date.until(release).total({ unit: "days", relativeTo: date });
console.log(days); // 81

// Calendar facts are properties, no formulas needed.
console.log(date.dayOfWeek); // 5 (Friday)
console.log(date.daysInMonth); // 30

// Temporal parses ISO 8601 only. For data in custom patterns, parse from
// the standard library converts to a Date. It interprets the value in the
// local time zone, so hand it to Temporal through that same zone to keep
// the calendar date intact.
import { parse } from "jsr:@std/datetime/parse";
const legacy = parse("06/12/2026", "MM/dd/yyyy");
const imported = Temporal.Instant.fromEpochMilliseconds(legacy.getTime())
  .toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDate();
console.log(imported.toString()); // 2026-06-12

/**
 * @title Format dates for any locale
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat} MDN: Intl.DateTimeFormat
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatRange} MDN: formatRange
 * @group Web Standard APIs
 *
 * Intl.DateTimeFormat turns a Date into text for any locale and time
 * zone. The dateStyle and timeStyle shortcuts cover most needs, and
 * formatRange renders a span of two dates without repeating the shared
 * parts. This example formats one fixed instant in several ways.
 */

// All examples format the same instant, given in UTC.
const date = new Date("2026-06-11T12:00:00Z");

// dateStyle picks a complete date layout for the locale. Passing an
// explicit timeZone makes the output independent of the machine settings.
const fullDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeZone: "UTC",
});
console.log(fullDate.format(date)); // Thursday, June 11, 2026

// dateStyle and timeStyle combine into a single string.
const dateTime = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});
console.log(dateTime.format(date)); // Jun 11, 2026, 12:00 PM

// Other locales bring their own month names, ordering, and punctuation.
const german = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeZone: "UTC",
});
console.log(german.format(date)); // Donnerstag, 11. Juni 2026

const japanese = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeZone: "UTC",
});
console.log(japanese.format(date)); // 2026年6月11日

// The timeZone option converts the instant before formatting. The same
// moment is morning in New York and evening in Tokyo.
const newYork = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "long",
  timeZone: "America/New_York",
});
console.log(newYork.format(date)); // 6/11/26, 8:00:00 AM EDT

const tokyo = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "long",
  timeZone: "Asia/Tokyo",
});
console.log(tokyo.format(date)); // 6/11/26, 9:00:00 PM GMT+9

// formatRange writes a date range compactly. Shared parts like the month
// and year appear only once.
const range = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});
const end = new Date("2026-06-15T12:00:00Z");
console.log(range.formatRange(date, end)); // Jun 11 – 15, 2026

// When the range crosses a month boundary, both months are spelled out.
const longRange = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const nextMonth = new Date("2026-07-02T12:00:00Z");
console.log(longRange.formatRange(date, nextMonth)); // June 11 – July 2, 2026

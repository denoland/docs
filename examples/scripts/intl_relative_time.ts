/**
 * @title Format relative time
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat} MDN: Intl.RelativeTimeFormat
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/format} MDN: format
 * @group Web Standard APIs
 *
 * Intl.RelativeTimeFormat produces phrases like 3 days ago or in 2
 * months for any locale. You pass a signed number and a unit, and the
 * formatter handles grammar, pluralization, and translation. This
 * example also builds a small helper that picks the right unit from a
 * millisecond difference.
 */

// Negative values describe the past, positive values the future.
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
console.log(rtf.format(-3, "day")); // 3 days ago
console.log(rtf.format(2, "month")); // in 2 months

// With numeric always, even a single day stays numeric.
console.log(rtf.format(-1, "day")); // 1 day ago
console.log(rtf.format(1, "day")); // in 1 day

// With numeric auto, the formatter prefers idiomatic words when they
// exist for the locale.
const auto = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
console.log(auto.format(-1, "day")); // yesterday
console.log(auto.format(1, "day")); // tomorrow
console.log(auto.format(0, "second")); // now
console.log(auto.format(-1, "week")); // last week

// Other locales come for free.
const spanish = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
console.log(spanish.format(-1, "day")); // ayer
console.log(spanish.format(2, "month")); // dentro de 2 meses

// Real code usually starts from a difference between two timestamps.
// This helper walks from the largest unit down and uses the first unit
// the difference fills at least once.
const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
  ["second", 1000],
];

function timeAgo(deltaMs: number): string {
  for (const [unit, ms] of units) {
    if (Math.abs(deltaMs) >= ms) {
      return auto.format(Math.round(deltaMs / ms), unit);
    }
  }
  return auto.format(0, "second");
}

// Fixed differences in milliseconds keep the demonstration exact.
console.log(timeAgo(-45 * 1000)); // 45 seconds ago
console.log(timeAgo(-90 * 60 * 1000)); // 1 hour ago
console.log(timeAgo(-26 * 60 * 60 * 1000)); // yesterday
console.log(timeAgo(11 * 24 * 60 * 60 * 1000)); // in 11 days
console.log(timeAgo(70 * 24 * 60 * 60 * 1000)); // in 2 months

// In an application you would compute the difference from the clock,
// for example timeAgo(postDate.getTime() - Date.now()).

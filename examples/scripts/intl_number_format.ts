/**
 * @title Format numbers and currencies
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat} MDN: Intl.NumberFormat
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatRange} MDN: formatRange
 * @group Web Standard APIs
 *
 * Intl.NumberFormat formats numbers for any locale and style. It handles
 * grouping separators, currency symbols, compact notation, measurement
 * units, and percentages, so you never need to build those strings by
 * hand. This example shows the most common options.
 */

// Plain formatting picks the grouping and decimal separators of the
// locale. English and German disagree on both.
console.log(new Intl.NumberFormat("en-US").format(1234567.891)); // 1,234,567.891
console.log(new Intl.NumberFormat("de-DE").format(1234567.891)); // 1.234.567,891

// The currency style places the symbol and rounds to the right number of
// fraction digits for that currency.
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
console.log(usd.format(1234.5)); // $1,234.50

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});
console.log(eur.format(1234.5)); // 1.234,50 €

// Compact notation abbreviates large numbers the way headlines do.
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });
console.log(compact.format(1234567)); // 1.2M

// The long compact display spells the magnitude out.
const compactLong = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "long",
});
console.log(compactLong.format(1234567)); // 1.2 million

// The unit style appends a localized measurement unit.
const speed = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer-per-hour",
});
console.log(speed.format(120)); // 120 km/h

// The long unit display writes the unit in full words.
const speedLong = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer-per-hour",
  unitDisplay: "long",
});
console.log(speedLong.format(120)); // 120 kilometers per hour

// The percent style multiplies by 100 and adds the sign. The default
// rounds to whole percents unless you ask for fraction digits.
const percent = new Intl.NumberFormat("en-US", { style: "percent" });
console.log(percent.format(0.485)); // 49%

const percentExact = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
});
console.log(percentExact.format(0.485)); // 48.5%

// formatRange renders a span of two values with locale aware punctuation.
// Deno supports it on every Intl.NumberFormat instance.
console.log(usd.formatRange(40, 60)); // $40.00 – $60.00
console.log(new Intl.NumberFormat("en-US").formatRange(2.9, 3.1)); // 2.9–3.1

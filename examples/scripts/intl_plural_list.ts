/**
 * @title Pluralize and format lists
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules} MDN: Intl.PluralRules
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat} MDN: Intl.ListFormat
 * @group Web Standard APIs
 *
 * Hand-rolled pluralization like adding an s breaks as soon as you
 * leave English. Intl.PluralRules tells you which grammatical category a
 * number falls into for a locale, and Intl.ListFormat joins items with
 * the right separators and conjunction. This example shows both.
 */

// English has two plural categories, one and other.
const english = new Intl.PluralRules("en-US");
console.log(english.select(1)); // one
console.log(english.select(2)); // other
console.log(english.select(0)); // other
console.log(english.resolvedOptions().pluralCategories); // [ "one", "other" ]

// Polish has four. Numbers ending in 2 to 4 use few, most others use
// many, and fractions fall back to other.
const polish = new Intl.PluralRules("pl");
console.log(polish.select(1)); // one
console.log(polish.select(2)); // few
console.log(polish.select(5)); // many
console.log(polish.select(22)); // few
console.log(polish.select(1.5)); // other

// Arabic uses all six categories, including zero, one, and two.
const arabic = new Intl.PluralRules("ar");
console.log(arabic.select(0)); // zero
console.log(arabic.select(1)); // one
console.log(arabic.select(2)); // two
console.log(arabic.select(6)); // few
console.log(arabic.select(15)); // many

// A pluralize helper maps each category to a word form. For English you
// only need two forms.
const fileForms: Record<string, string> = { one: "file", other: "files" };

function pluralize(count: number): string {
  return `${count} ${fileForms[english.select(count)]}`;
}

console.log(pluralize(1)); // 1 file
console.log(pluralize(3)); // 3 files
console.log(pluralize(0)); // 0 files

// Intl.ListFormat joins arrays the way prose does. The conjunction type
// produces an and list, including the Oxford comma for en-US.
const and = new Intl.ListFormat("en-US", { type: "conjunction" });
console.log(and.format(["red", "green", "blue"])); // red, green, and blue
console.log(and.format(["red", "green"])); // red and green

// The disjunction type produces an or list.
const or = new Intl.ListFormat("en-US", { type: "disjunction" });
console.log(or.format(["red", "green", "blue"])); // red, green, or blue

// Other locales swap in their own conjunctions and comma rules.
const german = new Intl.ListFormat("de-DE", { type: "conjunction" });
console.log(german.format(["rot", "grün", "blau"])); // rot, grün und blau

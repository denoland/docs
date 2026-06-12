/**
 * @title Parse and compare semver versions
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/semver/doc/~/parse} Doc: @std/semver parse
 * @resource {https://jsr.io/@std/semver/doc/~/satisfies} Doc: @std/semver satisfies
 * @group Standard library
 *
 * Version strings cannot be compared as plain text, because "1.10.0"
 * sorts before "1.2.0" alphabetically. The @std/semver package parses
 * semantic versions into objects and compares them by their numeric
 * parts, with full support for ranges like ^1.2.0.
 */

import {
  compare,
  format,
  maxSatisfying,
  parse,
  parseRange,
  satisfies,
} from "jsr:@std/semver";

// Parse turns a version string into an object with numeric fields.
const version = parse("1.2.3-rc.1");
console.log(version.major, version.minor, version.patch); // 1 2 3
console.log(version.prerelease); // [ "rc", 1 ]

// String comparison gets this wrong, semver comparison does not.
console.log("1.10.0" < "1.2.0"); // true
console.log(compare(parse("1.10.0"), parse("1.2.0"))); // 1

// Compare returns -1, 0, or 1, which makes it a ready-made sort
// comparator for a list of versions.
const versions = ["1.0.0", "2.1.3", "1.10.2", "0.9.0"].map(parse);
versions.sort(compare);
console.log(versions.map(format)); // [ "0.9.0", "1.0.0", "1.10.2", "2.1.3" ]

// Ranges use the same syntax as package manifests. Parse the range
// once, then test versions against it with satisfies.
const range = parseRange("^1.2.0");
console.log(satisfies(parse("1.9.9"), range)); // true
console.log(satisfies(parse("2.0.0"), range)); // false

// maxSatisfying picks the highest version that fits the range, which
// is how a package manager resolves a dependency.
const best = maxSatisfying(versions, parseRange(">=1.0.0 <2.0.0"));
console.log(format(best!)); // 1.10.2

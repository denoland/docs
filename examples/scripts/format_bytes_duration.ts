/**
 * @title Format bytes and durations for humans
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/fmt/doc/bytes/~/format} Doc: @std/fmt bytes format
 * @resource {https://jsr.io/@std/fmt/doc/duration/~/format} Doc: @std/fmt duration format
 * @group Standard library
 *
 * Raw numbers like 1536 bytes or 97000 milliseconds are hard to read in
 * logs and user interfaces. The @std/fmt package turns byte counts into
 * strings like 1.54 kB and millisecond durations into strings like
 * 1m 37s, with options for units and precision.
 */

import { format as formatBytes } from "jsr:@std/fmt/bytes";
import { format as formatDuration } from "jsr:@std/fmt/duration";

// Byte formatting picks a sensible unit automatically.
console.log(formatBytes(1536)); // 1.54 kB
console.log(formatBytes(1_234_567_890)); // 1.23 GB

// The default units are decimal, where 1 kB is 1000 bytes. The binary
// option switches to powers of 1024.
console.log(formatBytes(1536, { binary: true })); // 1.5 kiB

// More options control precision, signs, and bit units.
console.log(formatBytes(1536, { maximumFractionDigits: 0 })); // 2 kB
console.log(formatBytes(1536, { signed: true })); // +1.54 kB
console.log(formatBytes(1536, { bits: true })); // 1.54 kbit

// Duration formatting takes milliseconds. The default narrow style
// lists every unit, including the zero ones.
console.log(formatDuration(97_000)); // 0d 0h 1m 37s 0ms 0µs 0ns

// The ignoreZero option keeps only the units that matter, which is the
// form most logs and UIs want.
console.log(formatDuration(97_000, { ignoreZero: true })); // 1m 37s

// The full style spells the units out, and digital renders a clock
// style string.
console.log(formatDuration(97_000, { style: "full", ignoreZero: true })); // 1 minute, 37 seconds
console.log(formatDuration(97_000, { style: "digital" })); // 00:00:01:37:000:000:000

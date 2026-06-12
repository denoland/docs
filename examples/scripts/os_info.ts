/**
 * @title Get operating system information
 * @difficulty beginner
 * @tags cli
 * @run -S <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.build} Doc: Deno.build
 * @resource {https://docs.deno.com/api/node/os/} Doc: node:os
 * @group System
 *
 * Scripts often need to know what system they are running on, for example
 * to pick a platform specific binary or to include host details in logs.
 * Deno exposes this through Deno.build and a few dedicated functions, and
 * the node:os module offers the same data for code that already uses it.
 */
import os from "node:os";

// Deno.build describes the platform the running deno binary was built for.
// It is a plain object and requires no permissions.
console.log(Deno.build.os); // e.g. darwin
console.log(Deno.build.arch); // e.g. aarch64
console.log(Deno.build.target); // e.g. aarch64-apple-darwin

// The functions below report details about the host machine and need the
// system permission, granted with -S (short for --allow-sys).
console.log(Deno.hostname()); // e.g. MacBookPro.localdomain

// The kernel release of the operating system.
console.log(Deno.osRelease()); // e.g. 24.5.0

// Seconds since the machine was booted.
console.log(Deno.osUptime()); // e.g. 2083872

// The node:os module exposes the same information. Note that it follows
// different naming conventions, for example arm64 instead of aarch64.
console.log(os.platform()); // e.g. darwin
console.log(os.arch()); // e.g. arm64
console.log(os.hostname()); // e.g. MacBookPro.localdomain
console.log(os.uptime()); // e.g. 2083872

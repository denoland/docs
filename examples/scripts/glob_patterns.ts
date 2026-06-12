/**
 * @title Find files with glob patterns
 * @difficulty beginner
 * @tags cli
 * @run -R -W <url>
 * @resource {https://jsr.io/@std/fs/doc/~/expandGlob} Doc: @std/fs expandGlob
 * @resource {https://jsr.io/@std/path/doc/~/globToRegExp} Doc: @std/path globToRegExp
 * @group File System
 *
 * Glob patterns describe sets of file paths in one compact string, with *
 * matching within a path segment and ** matching across directories. This
 * example finds matching files on disk with expandGlob from the standard
 * library, and matches path strings in memory with globToRegExp.
 */

// We build a small directory tree to search through.
const dir = await Deno.makeTempDir();
await Deno.mkdir(`${dir}/src/util`, { recursive: true });
await Deno.mkdir(`${dir}/build`);
await Deno.writeTextFile(`${dir}/src/main.ts`, "");
await Deno.writeTextFile(`${dir}/src/util/helpers.ts`, "");
await Deno.writeTextFile(`${dir}/src/util/helpers_test.ts`, "");
await Deno.writeTextFile(`${dir}/build/bundle.ts`, "");
await Deno.writeTextFile(`${dir}/readme.md`, "");

// expandGlob walks the file system and yields every entry that matches the
// pattern. The ** segment matches any number of directories. The exclude
// option filters out paths, here the generated build directory.
import { expandGlob } from "jsr:@std/fs";

const found: string[] = [];
for await (
  const entry of expandGlob("**/*.ts", {
    root: dir,
    exclude: ["build"],
  })
) {
  found.push(entry.path.slice(dir.length + 1));
}

// The walk order depends on the file system, so we sort before printing.
console.log(found.sort());
// [ "src/main.ts", "src/util/helpers.ts", "src/util/helpers_test.ts" ]

// The Node.js API offers globbing too: glob from node:fs/promises is an
// async iterator of matching paths, with cwd and exclude options.
import { glob } from "node:fs/promises";

const nodeFound: string[] = [];
for await (const path of glob("**/*.ts", { cwd: dir, exclude: ["build"] })) {
  nodeFound.push(path);
}
console.log(nodeFound.sort());
// [ "src/main.ts", "src/util/helpers.ts", "src/util/helpers_test.ts" ]

// Sometimes the paths are already in memory, for instance from a config
// file or an API response. globToRegExp turns a glob into a RegExp so you
// can match strings without touching the disk.
import { globToRegExp } from "jsr:@std/path";

const pattern = globToRegExp("src/**/*.ts", { globstar: true });
console.log(pattern.test("src/main.ts")); // true
console.log(pattern.test("src/util/helpers.ts")); // true
console.log(pattern.test("build/bundle.ts")); // false

// A single * stays within one path segment, so it does not cross slashes.
const shallow = globToRegExp("src/*.ts");
console.log(shallow.test("src/main.ts")); // true
console.log(shallow.test("src/util/helpers.ts")); // false

// expandGlob reads directories, so it requires the -R permission.
await Deno.remove(dir, { recursive: true });

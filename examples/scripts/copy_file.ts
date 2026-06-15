/**
 * @title Copy a file
 * @difficulty beginner
 * @tags cli
 * @run -R -W <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.copyFile} Doc: Deno.copyFile
 * @resource {https://docs.deno.com/api/node/fs/} Doc: node:fs
 * @group File System
 *
 * Copying a file is a single call in Deno. This example copies a file, a
 * file into a directory tree, and shows the Node.js API equivalents.
 */

// We set up a temporary directory with a small file to copy.
const dir = await Deno.makeTempDir();
await Deno.writeTextFile(`${dir}/source.txt`, "Hello");

// Deno.copyFile copies a file to a destination path, replacing the
// destination if it already exists.
await Deno.copyFile(`${dir}/source.txt`, `${dir}/copy.txt`);
console.log(await Deno.readTextFile(`${dir}/copy.txt`)); // Hello

// The destination directory must exist; copyFile does not create it.
await Deno.mkdir(`${dir}/backup`);
await Deno.copyFile(`${dir}/source.txt`, `${dir}/backup/copy.txt`);

// There is a synchronous variant as well.
Deno.copyFileSync(`${dir}/source.txt`, `${dir}/copy2.txt`);

// The same operations are available through the Node.js API, which npm
// packages and ported code often use.
import { copyFile, cp } from "node:fs/promises";
await copyFile(`${dir}/source.txt`, `${dir}/copy3.txt`);

// cp with the recursive option also copies whole directories.
await cp(`${dir}/backup`, `${dir}/backup2`, { recursive: true });
console.log(await Deno.readTextFile(`${dir}/backup2/copy.txt`)); // Hello

// Reading and writing files requires the -R and -W permissions.
await Deno.remove(dir, { recursive: true });

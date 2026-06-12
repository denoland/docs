/**
 * @title Truncate a file
 * @difficulty beginner
 * @tags cli
 * @run -R -W <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.truncate} Doc: Deno.truncate
 * @resource {https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.truncate} Doc: Deno.FsFile.truncate
 * @group File System
 *
 * Truncating sets a file to an exact length without rewriting its
 * contents. The classic use case is log rotation, where a log file is cut
 * back to zero bytes while the program keeps writing to it. This example
 * shrinks a file, empties it, and shows what happens when you truncate to
 * a larger size.
 */

// We work in a temporary directory with a ten byte file.
const dir = await Deno.makeTempDir();
const path = `${dir}/numbers.txt`;
await Deno.writeTextFile(path, "0123456789");

// Deno.truncate cuts the file to the given length. Everything after that
// point is gone.
await Deno.truncate(path, 4);
console.log(await Deno.readTextFile(path)); // 0123

// Without a length it truncates to zero bytes, which empties the file but
// keeps it in place with its metadata.
await Deno.truncate(path);
console.log((await Deno.stat(path)).size); // 0

// An open file handle can be truncated too. Note that truncating does not
// move the write position, so we seek back to the start before reusing
// the handle.
const file = await Deno.open(path, { read: true, write: true });
await file.write(new TextEncoder().encode("hello world"));
await file.truncate(5);
await file.seek(0, Deno.SeekMode.Start);
const buf = new Uint8Array(5);
await file.read(buf);
console.log(new TextDecoder().decode(buf)); // hello
file.close();

// The gotcha: truncating to a size larger than the file extends it, and
// the new bytes are zeros. A three byte file truncated to six ends with
// three zero bytes, which is rarely what you want in a text file.
await Deno.writeTextFile(path, "abc");
await Deno.truncate(path, 6);
console.log(await Deno.readFile(path)); // Uint8Array(6) [ 97, 98, 99, 0, 0, 0 ]

// Truncating requires the -W permission; reading the results back
// requires -R.
await Deno.remove(dir, { recursive: true });

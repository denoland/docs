/**
 * @title Create hard links
 * @difficulty beginner
 * @tags cli
 * @run -R -W <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.link} Doc: Deno.link
 * @resource {https://docs.deno.com/examples/symlinks/} Example: Creating & resolving symlinks
 * @group File System
 *
 * A hard link is a second name for the same file. Unlike a symlink, which
 * is a small file that points to a path and breaks when the target moves,
 * a hard link is equal to the original name in every way. This example
 * creates one and shows that both names really are the same file.
 */

// We work in a temporary directory with one file.
const dir = await Deno.makeTempDir();
const original = `${dir}/original.txt`;
const alias = `${dir}/alias.txt`;
await Deno.writeTextFile(original, "first");

// Deno.link creates the hard link. Both names now refer to the same data
// on disk, so this does not copy anything.
await Deno.link(original, alias);

// The nlink field counts how many names a file has. It is null on
// Windows.
console.log((await Deno.stat(original)).nlink); // 2

// Writing through one name is immediately visible through the other,
// because there is only one file behind them.
await Deno.writeTextFile(alias, "written via alias");
console.log(await Deno.readTextFile(original)); // written via alias

// A hard link must be on the same file system as the original, and it
// cannot point to a directory. Symlinks have neither restriction, which
// is why they are the more common choice for shortcuts.

// Deleting one name only removes that name. The data survives as long as
// at least one name is left.
await Deno.remove(original);
console.log(await Deno.readTextFile(alias)); // written via alias
console.log((await Deno.stat(alias)).nlink); // 1

// Creating links requires the -W permission for both paths.
await Deno.remove(dir, { recursive: true });

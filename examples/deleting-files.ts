/**
 * @title Deleting Files
 * @difficulty beginner
 * @tags cli
 * @resource {https://docs.deno.com/api/deno/~/Deno.remove} Doc: Deno.remove
 * @group File System
 *
 * Removing files and directories is a common task. Deno has a number of
 * functions for this task.
 */

// In the case that we want to remove a simple file,
// we can simply call Deno.remove with the filename as
// a parameter
await Deno.remove("example.txt");

// There is also a sync version of the api available
Deno.removeSync("example.txt");

// If we want to remove a directory, we could do exactly
// what we did above. If the directory has contents, the
// call would error out. If we want to recursively delete
// the contents of a directory, we should set recursive to
// true
await Deno.remove("./dir", { recursive: true });

// A common pattern is to remove a file or directory only
// if it already exists. The correct way of doing this is
// by just doing it and trying to catch any NotFound errors.
try {
  await Deno.remove("example.txt");
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
}

/**
 * @title Checking for directory existence
 * @difficulty beginner
 * @tags cli, deploy
 * @run -R -W <url>
 * @group File System
 *
 * When creating directories it can be useful to first ensure that
 * such a directory doesn't already exist.
 * There are a number of ways to do this.
 */

// Use the `exists` utility from the std library to check for existence of a file or folder.
// Note: Can create a race condition if followed by file operation.
// Consider the alternative below.
import { exists } from "jsr:@std/fs/exists";
await exists("./this_file_or_folder_exists"); // true
await exists("./this_file_or_folder_does_not_exist"); // false

// We can also use this function to check if the item on a path is a file or a directory
await exists("./directory", { isDirectory: true }); // true
await exists("./file", { isDirectory: true }); // false

// Do not use the above function if performing a check directly before another operation on that folder.
// Doing so creates a time-of-check to time-of-use race condition: the folder can be created or removed
// in the gap between `exists` returning and your next call, so the result may already be stale. That is
// why `exists` is not recommended for that usecase. Prefer to attempt the operation directly and handle
// the error, or probe with `Deno.lstat` as shown below and act on the result you get back.
try {
  await Deno.lstat("./example_directory");
  console.log("Folder exists");
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
  console.log("Folder does not exist");
}

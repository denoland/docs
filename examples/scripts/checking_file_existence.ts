/**
 * @title Checking for file existence
 * @difficulty beginner
 * @tags cli, deploy
 * @run --allow-read --allow-write <url>
 * @group File System
 *
 * When creating files it can be useful to first ensure that
 * such a file doesn't already exist.
 * There are a number of ways to do this.
 */

// Use the `exists` utility from the std library to check for existence of a file or folder.
// Note: Can create a race condition if followed by file operation.
// Consider the alternative below.
import { exists } from "jsr:@std/fs/exists";
await exists("./this_file_or_folder_exists"); // true
await exists("./this_file_or_folder_does_not_exist"); // false

// We can also use this function to check if the item on a path is a file or a directory
await exists("./file", { isFile: true }); // true
await exists("./directory", { isFile: true }); // false

// Do not use the above function if performing a check directly before another operation on that file.
// Doing so creates a race condition. The `exists` function is not recommended for that usecase.
// Consider this alternative which checks for existence of a file without doing any other filesystem operations.
try {
  const stats = await Deno.lstat("example.txt");
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
  console.log("File does not exist");
}

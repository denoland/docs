/**
 * @title Creating & removing directories
 * @difficulty beginner
 * @tags cli
 * @run --allow-write <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.mkdir} Doc: Deno.mkdir
 * @resource {https://docs.deno.com/api/deno/~/Deno.remove} Doc: Deno.remove
 * @group File System
 *
 * Creating and removing directories is a common task. Deno has a number of
 * functions for this task.
 */

// The `Deno.mkdir()` function creates a directory at the specified path.
// If the directory already exists, it errors.
await Deno.mkdir("new_dir");

// A directory can also be created recursively. In the code below, three new
// directories are created: `./dir`, `./dir/dir2`, and `./dir/dir2/subdir`. If
// the recursive option is specified the function will not error if any of the
// directories already exist.
await Deno.mkdir("./dir/dir2/subdir", { recursive: true });

// Directories can also be removed. This function below removes the `./new_dir`
// directory. If the directory is not empty, the function will error.
await Deno.remove("./new_dir");

// To remove a directory recursively, use the `recursive` option. This will
// remove the `./dir` directory and all of its contents.
await Deno.remove("./dir", { recursive: true });

// Synchronous versions of the above functions are also available.
Deno.mkdirSync("new_dir");
Deno.removeSync("new_dir");

// Creating and removing directories requires the `write` permission.

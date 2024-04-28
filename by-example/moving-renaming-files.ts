/**
 * @title Moving/Renaming Files
 * @difficulty beginner
 * @tags cli
 * @run --allow-read=./ --allow-write=./ <url>
 * @resource {https://deno.land/api?s=Deno.rename} Doc: Deno.rename
 *
 * An example of how to move and rename files and directories in Deno.
 */

// To rename or move a file, you can use the `Deno.rename` function. The first
// argument is the path to the file to rename. The second argument is the new
// path.
await Deno.writeTextFile("./hello.txt", "Hello World!");
await Deno.rename("./hello.txt", "./hello-renamed.txt");
console.log(await Deno.readTextFile("./hello-renamed.txt"));

// If the source file or the destination directory does not exist, the function
// will reject the returned promise with a `Deno.errors.NotFound` error. You can
// catch this error with a `try/catch` block.
try {
  await Deno.rename("./hello.txt", "./does/not/exist");
} catch (err) {
  console.error(err);
}

// A synchronous version of this function is also available.
Deno.renameSync("./hello-renamed.txt", "./hello-again.txt");

// If the destination file already exists, it will be overwritten.
await Deno.writeTextFile("./hello.txt", "Invisible content.");
await Deno.rename("./hello-again.txt", "./hello.txt");
console.log(await Deno.readTextFile("./hello.txt"));

// Read and write permissions are necessary to perform this operation. The
// source file needs to be readable and the destination path needs to be
// writable.

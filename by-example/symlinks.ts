/**
 * @title Creating & Resolving Symlinks
 * @difficulty beginner
 * @tags cli
 * @run --allow-write --allow-read <url>
 * @resource {https://deno.land/api?s=Deno.writeTextFile} Doc: Deno.writeTextFile
 * @resource {https://deno.land/api?s=Deno.symlink} Doc: Deno.symlink
 *
 * Creating and resolving symlink is a common task. Deno has a number of
 * functions for this task.
 */

// First we will create a text file to link to.
await Deno.writeTextFile("example.txt", "hello from symlink!");

// Now we can create a soft link to the file
await Deno.symlink("example.txt", "link");

// To resolve the path of a symlink, we can use Deno.realPath
console.log(await Deno.realPath("link"));

// Symlinks are automatically resolved, so we can just read
// them like text files
console.log(await Deno.readTextFile("link"));

// In certain cases, soft links don't work. In this case we
// can choose to make "hard links".
await Deno.link("example.txt", "hardlink");
console.log(await Deno.readTextFile("hardlink"));

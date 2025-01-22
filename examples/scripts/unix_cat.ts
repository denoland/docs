/**
 * @title Unix cat
 * @difficulty beginner
 * @tags cli
 * @run --allow-read cat.ts file1 file2
 * @resource {https://docs.deno.com/api/deno/~/Deno.args} Deno args API docs
 * @resource {https://docs.deno.com/api/deno/~/Deno.open} Deno open API docs
 * @resource {https://docs.deno.com/api/deno/~/Deno.stdout} Deno stdout API docs
 * @resource {https://docs.deno.com/api/deno/~/Deno.FsFile#property_readable} Deno File System API docs
 * @group File System
 *
 * In Unix, the `cat` command is a utility that reads files and writes them to standard output. You can use Deno to mimic the behavior of the `cat` command. <br><br> In this program each command-line argument is assumed to be a filename, the file is opened, and printed to stdout (e.g. the console).
 */

// Create a script that reads the contents of one or more files and writes them to standard output.
for (const filename of Deno.args) {
  const file = await Deno.open(filename);
  await file.readable.pipeTo(Deno.stdout.writable, { preventClose: true });
}

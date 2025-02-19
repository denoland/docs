/**
 * @title Subprocess Spawning: running other files using subprocesses
 * @difficulty intermediate
 * @tags cli
 * @run --allow-net --allow-run --allow-read <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.Command} Doc: Deno.Command
 * @resource {https://docs.deno.com/api/deno/~/Deno.FsFile} Doc: Deno.FsFile
 * @resource {https://docs.deno.com/api/deno/~/Deno.args} Doc: Deno.args
 * @group File System
 *
 * An example of a subprocess being spawned to run specified files using CLI flags.
 */

import { parseArgs } from "jsr:@std/cli";
// Grab the file name using the parseArgs function from the standard library.
// If no file is provided, exit with an error.
import { expandGlob } from "jsr:@std/fs";

const flags = parseArgs(Deno.args, {
  string: ["file"],
  default: {
    file: "",
  },
});

if (!flags.file) {
  console.error("No file provided");
  Deno.exit(1);
}

// Use expandGlob to find all files matching the provided filename.
const FilesList = await Array.fromAsync(
  expandGlob(`**/*${flags.file}*`, { root: "." }),
);

const files = FilesList.filter((files) => files.name.includes(flags.file));

// If no files are found, exit with an error.
if (files.length === 0) {
  console.error("No files found");
  Deno.exit(1);
}

// If multiple files are found, exit with an error.
if (files.length > 1) {
  console.error("Multiple files found");
  Deno.exit(1);
}

const file = files[0];

// Use the Deno.Command class to create a new command that will run the
// specified file.
const command = new Deno.Command(Deno.execPath(), {
  args: [file?.path],
});

// Try to spawn the command and catch any errors that may occur.
// Wait for the subprocess to finish and log the exit code.
try {
  const child = command.spawn();

  child.ref();
} catch (error) {
  console.error("Error while running the file: ", error);
  Deno.exit(4);
}

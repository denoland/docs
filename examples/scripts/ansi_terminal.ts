/**
 * @title Control the terminal with ANSI escape codes
 * @difficulty intermediate
 * @tags cli
 * @run <url>
 * @resource {https://jsr.io/@std/fmt/doc/colors/~} Doc: @std/fmt colors
 * @resource {https://docs.deno.com/api/deno/~/Deno.stdout} Doc: Deno.stdout
 * @group CLI
 *
 * Terminals interpret special byte sequences, called ANSI escape codes, as
 * commands: change the text color, erase a line, move or hide the cursor.
 * Writing them directly is all it takes to build colored output and
 * self-updating status lines without any dependencies.
 */

import { green } from "jsr:@std/fmt@^1.0.0/colors";
import { delay } from "jsr:@std/async@^1.0.0/delay";

// Escape sequences start with the escape byte, written \x1b, followed by [
// and a command. Writing raw bytes to stdout keeps full control over when
// a newline is emitted.
const encoder = new TextEncoder();
function write(text: string) {
  Deno.stdout.writeSync(encoder.encode(text));
}

// Colors and text styles are select graphic rendition commands. The
// sequence \x1b[31m switches to red and \x1b[0m resets all styling. Always
// reset, otherwise the style leaks into the next line of output.
console.log("\x1b[31mred\x1b[0m \x1b[1mbold\x1b[0m \x1b[4munderline\x1b[0m");

// For colors alone you rarely need raw codes. The standard library wraps
// them in plain functions that emit the same bytes:
console.log(green("green via @std/fmt/colors"));

// Now the classic trick behind installers and download counters: a single
// status line that rewrites itself. The sequence \x1b[2K erases the whole
// current line and \r returns the cursor to column zero, so the next write
// replaces the line instead of appending. \x1b[?25l hides the cursor while
// the line is being redrawn and \x1b[?25h shows it again. Restore it in a
// finally block, otherwise an early exception leaves the terminal without
// a cursor. Related codes move the cursor instead of erasing: \x1b[1A goes
// up one line and \x1b[1B goes down.
const steps = ["Resolving packages", "Downloading", "Linking", "Cleaning up"];

// Redrawing a line only works on an interactive terminal. When output is
// piped, print ordinary lines instead.
if (Deno.stdout.isTerminal()) {
  write("\x1b[?25l");
  try {
    for (let i = 0; i < steps.length; i++) {
      write(`\x1b[2K\r[${i + 1}/${steps.length}] ${steps[i]}...`);
      await delay(600);
    }
    write("\x1b[2K\rInstall complete.\n");
  } finally {
    write("\x1b[?25h");
  }
} else {
  for (const step of steps) {
    console.log(`${step}...`);
    await delay(100);
  }
  console.log("Install complete.");
}

// In a terminal the four steps flash by on one line, which then settles on
// the final text:
//
//   Install complete.

// When piped, the fallback prints each step on its own line:
//
//   deno run ansi_terminal.ts | cat
//   red bold underline
//   green via @std/fmt/colors
//   Resolving packages...
//   Downloading...
//   Linking...
//   Cleaning up...
//   Install complete.

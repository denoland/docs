/**
 * @title Show progress bars and spinners
 * @difficulty intermediate
 * @tags cli
 * @run <url>
 * @resource {https://jsr.io/@std/cli/doc/unstable-spinner/~} Doc: @std/cli Spinner
 * @resource {https://jsr.io/@std/cli/doc/unstable-progress-bar/~} Doc: @std/cli ProgressBar
 * @group CLI
 *
 * Long-running command line tools feel broken when they print nothing. The
 * standard library ships a Spinner for tasks of unknown length and a
 * ProgressBar for tasks with a known total. Both are currently exported
 * from unstable submodules of the cli package, so their APIs may still
 * change.
 */

// Spinner and ProgressBar live behind unstable- import paths until the
// APIs are stabilized.
import { Spinner } from "jsr:@std/cli@^1.0.30/unstable-spinner";
import { ProgressBar } from "jsr:@std/cli@^1.0.30/unstable-progress-bar";
import { delay } from "jsr:@std/async@^1.0.0/delay";

// Animations only make sense on an interactive terminal. When output is
// piped to a file or another process, redrawing the same line just dumps
// control characters into the stream, so check for a terminal first and
// fall back to plain lines.
const isInteractive = Deno.stdout.isTerminal();

// A spinner suits work with no measurable progress, like waiting on the
// network. It animates on its own; update the message as phases change.
if (isInteractive) {
  const spinner = new Spinner({
    message: "Contacting server...",
    color: "yellow",
  });
  spinner.start();
  await delay(1500);
  spinner.message = "Downloading manifest...";
  await delay(1500);
  spinner.stop();
}
console.log("Manifest downloaded.");

// A progress bar suits work with a known total. Progress is reported by
// assigning to the value property, and stop finishes the line. The bar
// redraws on a one second interval by default, and the formatter option
// controls the layout of the line.
const files = ["a.txt", "b.txt", "c.txt", "d.txt", "e.txt"];
if (isInteractive) {
  const bar = new ProgressBar({
    max: files.length,
    fillChar: "#",
    emptyChar: "-",
    formatter: (f) =>
      `[${f.styledTime}] [${f.progressBar}] ${f.value}/${f.max} files`,
  });
  for (const _file of files) {
    await delay(400);
    bar.value += 1;
  }
  await bar.stop();
} else {
  // The non-interactive fallback logs one line per step instead.
  for (const [i, file] of files.entries()) {
    await delay(100);
    console.log(`Copied ${file} (${i + 1}/${files.length})`);
  }
}
console.log("Done.");

// In a terminal the spinner animates in place while the message changes,
// and the bar fills a single line that ends like this:
//
//   ⠏ Downloading manifest...
//   [00:02] [##################################################] 5/5 files

// When output is piped, isTerminal() is false and only the fallback lines
// are printed:
//
//   deno run progress_spinners.ts | cat
//   Manifest downloaded.
//   Copied a.txt (1/5)
//   Copied b.txt (2/5)
//   Copied c.txt (3/5)
//   Copied d.txt (4/5)
//   Copied e.txt (5/5)
//   Done.

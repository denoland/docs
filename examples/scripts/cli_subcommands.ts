/**
 * @title Build a CLI with subcommands
 * @difficulty intermediate
 * @tags cli
 * @run <url>
 * @resource {https://jsr.io/@std/cli/doc/parse-args/~} Doc: @std/cli parseArgs
 * @resource {/examples/command_line_arguments} Example: Command line arguments
 * @group CLI
 *
 * Tools like git and deno itself take a subcommand first and flags after
 * it. The pattern is easy to build by hand: treat the first element of
 * Deno.args as the command name, dispatch to a function, and let each
 * command parse its own flags with parseArgs from node:util.
 */

import { parseArgs } from "node:util";

// A tiny task manager. State lives in memory here to keep the example
// small; a real tool would persist it to a file.
interface Task {
  title: string;
  urgent: boolean;
}

const tasks: Task[] = [];

// Each command is a plain function that receives only the arguments after
// the command name and returns an exit code. This keeps commands easy to
// unit test. Every command declares just its own flags.
function runInit(args: string[]): number {
  const { values } = parseArgs({
    args,
    options: { name: { type: "string", default: "my-todos" } },
  });
  console.log(`Initialized task list "${values.name}".`);
  return 0;
}

function runAdd(args: string[]): number {
  const { values } = parseArgs({
    args,
    options: {
      title: { type: "string" },
      urgent: { type: "boolean", default: false },
    },
  });
  // Validate required flags and signal failure with a nonzero exit code.
  if (!values.title) {
    console.error("error: add requires --title");
    return 1;
  }
  tasks.push({ title: values.title, urgent: values.urgent! });
  console.log(`Added "${values.title}"${values.urgent ? " (urgent)" : ""}.`);
  return 0;
}

function runList(args: string[]): number {
  const { values } = parseArgs({
    args,
    options: { "urgent-only": { type: "boolean", default: false } },
  });
  const visible = values["urgent-only"] ? tasks.filter((t) => t.urgent) : tasks;
  if (visible.length === 0) {
    console.log("No tasks yet.");
    return 0;
  }
  for (const [i, task] of visible.entries()) {
    console.log(`${i + 1}. ${task.title}${task.urgent ? " (urgent)" : ""}`);
  }
  return 0;
}

function printHelp() {
  console.log(`todo - a tiny task manager

Usage: todo <command> [options]

Commands:
  init [--name <name>]             create a new task list
  add --title <title> [--urgent]   add a task
  list [--urgent-only]             show tasks
  help                             show this message`);
}

// The dispatcher maps the first argument to a command function. Unknown
// commands print an error and return a distinct exit code so scripts and
// shells can detect misuse.
function main(args: string[]): number {
  const [command, ...rest] = args;
  switch (command) {
    case undefined:
    case "help":
      printHelp();
      return 0;
    case "init":
      return runInit(rest);
    case "add":
      return runAdd(rest);
    case "list":
      return runList(rest);
    default:
      console.error(`error: unknown command "${command}"`);
      console.error('Run "todo help" for a list of commands.');
      return 2;
  }
}

// With no arguments the program prints its help and then, because the
// dispatcher is just a function, demonstrates a session by calling it
// directly. With arguments it dispatches them and exits with the returned
// code.
if (Deno.args.length === 0) {
  printHelp();
  console.log("\nDemo session:");
  main(["init", "--name", "groceries"]);
  main(["add", "--title", "milk"]);
  main(["add", "--title", "pay rent", "--urgent"]);
  main(["list"]);
} else {
  Deno.exit(main(Deno.args));
}

// parseArgs from node:util is the web-and-Node-portable choice. The
// standard library variant, parseArgs from jsr:@std/cli, adds aliases,
// collectable flags, and negatable booleans when a tool outgrows this one.

// Real runs of the script, with their output:
//
//   deno run cli_subcommands.ts add --title "milk"
//   Added "milk".
//
//   deno run cli_subcommands.ts add --title "pay rent" --urgent
//   Added "pay rent" (urgent).
//
//   deno run cli_subcommands.ts add
//   error: add requires --title
//   (exit code 1)
//
//   deno run cli_subcommands.ts remove
//   error: unknown command "remove"
//   Run "todo help" for a list of commands.
//   (exit code 2)
//
// Each run above is a separate process, so the in-memory list starts empty
// every time. That is why the demo session calls main several times within
// one run before listing.

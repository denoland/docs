/**
 * @title Subprocesses: Introspecting commands before running
 * @difficulty intermediate
 * @tags cli
 * @run --allow-run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.Command} Doc: Deno.Command
 * @group System
 *
 * Deno.Command takes an executable and argv; there is no string "builder".
 * To inspect what will run, log the executable, args, and options you pass.
 * This example prints a human-readable approximation of the command line
 * for your OS, then executes it and prints the result.
 */

function quotePosix(s: string): string {
  return /^[A-Za-z0-9._\-/:@+=,]+$/.test(s)
    ? s
    : `'${s.replaceAll("'", `'\"'\"'`)}'`;
}

function quoteWindows(s: string): string {
  // Minimal Windows quoting suitable for display only (not for re-parsing).
  if (!/[ \t\"&|<>^]/.test(s)) return s;
  let out = "";
  let bs = 0;
  for (const ch of s) {
    if (ch === "\\") {
      bs++;
      out += "\\";
    } else if (ch === '"') {
      out += "\\".repeat(bs) + '\\"';
      bs = 0;
    } else {
      bs = 0;
      out += ch;
    }
  }
  return `"${out}"`;
}

function displayCommand(exe: string, args: string[]): string {
  const q = Deno.build.os === "windows" ? quoteWindows : quotePosix;
  return [q(exe), ...args.map(q)].join(" ");
}

// Allow users to pass a command to try; default to `deno --version`.
const exe = Deno.args[0] ?? Deno.execPath();
const argv = Deno.args.length > 1 ? Deno.args.slice(1) : ["--version"];

const options: Deno.CommandOptions = {
  args: argv,
  cwd: Deno.cwd(),
  env: { DEMO_ENV: "1" }, // demo: show env override in effect
  stdout: "piped",
  stderr: "piped",
  // windowsRawArguments: false, // set true only if you need raw arg passing on Windows
};

console.log("About to run:");
console.log("  executable:", exe);
console.log("  args:", JSON.stringify(argv));
console.log("  cwd:", options.cwd);
console.log("  env overrides:", options.env);
console.log("  display (approx):", displayCommand(exe, argv));

const cmd = new Deno.Command(exe, options);
const result = await cmd.output();

const td = new TextDecoder();
console.log("\nResult:");
console.log(
  "  success:",
  result.success,
  "code:",
  result.code,
  "signal:",
  result.signal ?? "none",
);
if (result.stdout?.length) {
  console.log("  stdout:\n" + td.decode(result.stdout).trim());
}
if (result.stderr?.length) {
  console.log("  stderr:\n" + td.decode(result.stderr).trim());
}

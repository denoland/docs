/**
 * @title Run a subprocess with custom env and cwd
 * @difficulty intermediate
 * @tags cli
 * @run --allow-run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.spawn} Doc: Deno.spawn
 * @resource {https://docs.deno.com/examples/subprocesses_output/} Example: Subprocesses: Collecting output
 * @group System
 *
 * A subprocess normally inherits the environment variables and working
 * directory of its parent. The spawn options can override both, which is
 * useful for passing configuration to a child or running a tool inside a
 * specific directory. The child here is deno eval, so the example is
 * portable.
 */

// Deno.spawn takes the command, its arguments, and options. The env option
// adds variables on top of the inherited environment, and the child's
// stdout stream offers the same convenience methods as a fetch Response.
const withEnv = Deno.spawn(Deno.execPath(), [
  "eval",
  "console.log(Deno.env.get('GREETING'))",
], {
  env: { GREETING: "hello from parent" },
  stdout: "piped",
});
console.log((await withEnv.stdout.text()).trim()); // hello from parent
await withEnv.status;

// With clearEnv set to true the child does not inherit anything, it only
// gets the variables listed in env. Even PATH is not passed on, so this is
// best combined with an absolute path to the executable. Note that the
// operating system or the child itself may still add a few variables of its
// own. A Deno child, for example, puts its node shim directory on PATH, so
// this checks HOME instead.
const cleared = Deno.spawn(Deno.execPath(), [
  "eval",
  "console.log('has HOME:', Deno.env.has('HOME'))",
], {
  env: { GREETING: "hello again" },
  clearEnv: true,
  stdout: "piped",
});
console.log((await cleared.stdout.text()).trim()); // has HOME: false
await cleared.status;

// The cwd option sets the working directory the child starts in. The child
// reports its own Deno.cwd() to prove it. Deno.spawnAndWait runs the
// command to completion and collects everything in one call.
const withCwd = await Deno.spawnAndWait(Deno.execPath(), [
  "eval",
  "console.log(Deno.cwd())",
], {
  cwd: "/",
  stdout: "piped",
});
console.log(new TextDecoder().decode(withCwd.stdout).trim()); // /

// The parent's own working directory is untouched by the child's cwd.
console.log(Deno.cwd() === "/"); // false

// The same options exist on the underlying Deno.Command API, which is the
// right tool when you need to configure a command before spawning it.

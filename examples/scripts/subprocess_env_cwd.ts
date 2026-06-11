/**
 * @title Run a subprocess with custom env and cwd
 * @difficulty intermediate
 * @tags cli
 * @run --allow-run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.Command} Doc: Deno.Command
 * @resource {https://docs.deno.com/examples/subprocesses_output/} Example: Subprocesses: Collecting output
 * @group System
 *
 * A subprocess normally inherits the environment variables and working
 * directory of its parent. Deno.Command can override both, which is useful
 * for passing configuration to a child or running a tool inside a specific
 * directory. The child here is deno eval, so the example is portable.
 */

const decoder = new TextDecoder();

// The env option adds variables on top of the inherited environment. The
// child process prints the variable to prove it arrived.
const withEnv = await new Deno.Command(Deno.execPath(), {
  args: ["eval", "console.log(Deno.env.get('GREETING'))"],
  env: { GREETING: "hello from parent" },
}).output();
console.log(decoder.decode(withEnv.stdout).trim()); // hello from parent

// With clearEnv set to true the child does not inherit anything, it only
// gets the variables listed in env. Even PATH is gone, so this is best
// combined with an absolute path to the executable. Note that the operating
// system may still inject a few variables of its own.
const cleared = await new Deno.Command(Deno.execPath(), {
  args: ["eval", "console.log('has PATH:', Deno.env.has('PATH'))"],
  env: { GREETING: "hello again" },
  clearEnv: true,
}).output();
console.log(decoder.decode(cleared.stdout).trim()); // has PATH: false

// The cwd option sets the working directory the child starts in. The child
// reports its own Deno.cwd() to prove it.
const withCwd = await new Deno.Command(Deno.execPath(), {
  args: ["eval", "console.log(Deno.cwd())"],
  cwd: "/",
}).output();
console.log(decoder.decode(withCwd.stdout).trim()); // /

// The parent's own working directory is untouched by the child's cwd.
console.log(Deno.cwd() === "/"); // false

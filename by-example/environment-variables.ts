/**
 * @title Environment Variables
 * @difficulty beginner
 * @tags cli, deploy
 * @run --allow-env <url>
 * @resource {https://deno.land/api?s=Deno.env} Doc: Deno.env
 * @resource {https://docs.deno.com/deploy/manual/environment-variables} Deploy Docs: Environment Variables
 * @group System
 *
 * Environment variables can be used to configure the behavior of a program,
 * or pass data from one program to another.
 */

// Here an environment variable with the name "PORT" is read. If this variable
// is set the return value will be a string. If it is unset it will be `undefined`.
const PORT = Deno.env.get("PORT");
console.log("PORT:", PORT);

// You can also get an object containing all environment variables.
const env = Deno.env.toObject();
console.log("env:", env);

// Environment variables can also be set. The set environment variable only affects
// the current process, and any new processes that are spawned from it. It does
// not affect parent processes or the user shell.
Deno.env.set("MY_PASSWORD", "123456");

// You can also unset an environment variable.
Deno.env.delete("MY_PASSWORD");

// Note that environment variables are case-sensitive on unix, but not on
// Windows. This means that these two invocations will have different results
// between platforms.
Deno.env.set("MY_PASSWORD", "123");
Deno.env.set("my_password", "456");
console.log("UPPERCASE:", Deno.env.get("MY_PASSWORD"));
console.log("lowercase:", Deno.env.get("my_password"));

// Access to environment variables is only possible if the Deno process is
// running with env var permissions (`--allow-env`). You can limit the permission
// to only a specific number of environment variables (`--allow-env=PORT,MY_PASSWORD`).

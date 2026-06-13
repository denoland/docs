/**
 * @title Bundle code with Deno.bundle
 * @difficulty intermediate
 * @tags cli
 * @run --unstable-bundle --allow-read --allow-write --allow-env --allow-net <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.bundle} Doc: Deno.bundle
 * @resource {https://docs.deno.com/runtime/reference/bundling/} Bundling in the Deno manual
 * @group CLI
 *
 * Deno.bundle compiles a module graph into a single JavaScript file,
 * resolving and inlining all imports, including jsr: and npm: packages. It is
 * the programmatic counterpart of the deno bundle subcommand, useful in build
 * scripts that need to produce self-contained output for browsers, serverless
 * platforms, or distribution.
 */

// Write a small entrypoint to bundle. It pulls a helper from the standard
// library on JSR, so the bundler has a real dependency to resolve.
await Deno.writeTextFile(
  "app.ts",
  `import { toCamelCase } from "jsr:@std/text";
console.log(toCamelCase("hello from the bundle"));
`,
);

// Bundle the entrypoint. The platform option targets either "deno" or
// "browser", and write makes the bundler save the file itself. Without
// outputPath the bundled code is returned in result.outputFiles instead.
const result = await Deno.bundle({
  entrypoints: ["./app.ts"],
  outputPath: "dist/app.js",
  platform: "deno",
  minify: true,
  write: true,
});

// The result reports success and any errors or warnings in a structured
// form, so a build script can fail loudly when something goes wrong.
if (!result.success) {
  for (const error of result.errors) console.error(error.text);
  Deno.exit(1);
}

// The bundle is a single ordinary JavaScript file with the @std/text code
// inlined. It runs anywhere, with no imports left to resolve.
const stat = await Deno.stat("dist/app.js");
console.log(`bundled ${stat.size} bytes`); // bundled 462 bytes

// Run it to prove it is self-contained. Deno.spawnAndWait is a shorthand
// for Deno.Command; pass stdout: "piped" to capture the output instead of
// inheriting the terminal.
const output = await Deno.spawnAndWait(Deno.execPath(), {
  args: ["run", "dist/app.js"],
  stdout: "piped",
});
console.log(new TextDecoder().decode(output.stdout)); // helloFromTheBundle

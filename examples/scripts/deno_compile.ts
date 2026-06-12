/**
 * @title Compile a script into an executable
 * @difficulty beginner
 * @tags cli
 * @run <url> Deno
 * @resource {https://docs.deno.com/runtime/reference/cli/compile/} Doc: deno compile
 * @resource {/examples/command_line_arguments} Example: Command line arguments
 * @group CLI
 *
 * The deno compile subcommand turns a script and all of its dependencies
 * into a single self-contained binary. The result runs on machines that do
 * not have Deno installed, which makes it a simple way to ship command line
 * tools.
 */

// Any script can be compiled. This one greets whoever is named in the first
// command line argument.
const name = Deno.args[0] ?? "world";
console.log(`Hello, ${name}!`);

// Compile it. Deno bundles the script together with the runtime and writes
// an executable named after the file:
//
//   deno compile greet.ts
//   Compile greet.ts to greet
//
//   Embedded Files
//
//   greet
//   └── greet.ts (70B)
//
//   Files: 1.53KB
//   Metadata: 1.38KB
//   Remote modules: 12B

// The binary is a normal executable. It is large, roughly 70 MB, because
// the whole JavaScript runtime is embedded in it.
//
//   ./greet
//   Hello, world!
//
//   ./greet Deno
//   Hello, Deno!

// Use the --output flag to pick a different name or path for the binary:
//
//   deno compile --output hello greet.ts

// Permission flags given at compile time are baked into the binary. This
// program fetches a page, so it is compiled with -N for network access.
// Whoever runs the binary is never prompted, and the program can never
// exceed the permissions it was compiled with.
//
//   deno compile -N --output check_site server.ts
//   Check server.ts
//   Compile server.ts to check_site
//
//   ./check_site
//   200

// Data files are not picked up automatically, because only imported modules
// are bundled. The --include flag embeds extra files into the binary. The
// program reads them with regular file APIs, resolved against
// import.meta.url:
//
//   const banner = await Deno.readTextFile(
//     new URL("./banner.txt", import.meta.url),
//   );
//
//   deno compile --include banner.txt --output app app.ts
//   Compile app.ts to app
//
//   Embedded Files
//
//   app
//   ├── app.ts (377B)
//   └── banner.txt (20B)
//
//   ./app
//   Welcome to the show

// Cross-compilation produces binaries for other platforms. The --target
// flag accepts these values:
//
//   x86_64-unknown-linux-gnu
//   aarch64-unknown-linux-gnu
//   x86_64-pc-windows-msvc
//   x86_64-apple-darwin
//   aarch64-apple-darwin

// On the first use of a foreign target, Deno downloads the runtime for that
// platform and caches it. This Linux binary was produced on a Mac:
//
//   deno compile --target x86_64-unknown-linux-gnu --output greet-linux greet.ts
//   Compile greet.ts to greet-linux
//   Download https://dl.deno.land/.../denort-x86_64-unknown-linux-gnu.zip
//
//   file greet-linux
//   greet-linux: ELF 64-bit LSB pie executable, x86-64 ...

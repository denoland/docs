# `npm:` specifiers

Since version 1.28, Deno has native support for importing npm packages. This is
done by importing using `npm:` specifiers.

The way these work is best described with an example that you can run with
`deno run --allow-env`:

```ts, ignore
import chalk from "npm:chalk@5";

console.log(chalk.green("Hello!"));
```

These npm specifiers have the following format:

```ts, ignore
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

Another example with express:

```js, ignore
// main.js
import express from "npm:express@^4.17";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000);
console.log("listening on http://localhost:3000/");
```

Then doing the following will start a simple express server:

```sh
$ deno run -A main.js
listening on http://localhost:3000/
```

When doing this, no `npm install` is necessary and no `node_modules` folder is
created. These packages are also subject to the same permissions as Deno
applications.

## npm executable scripts

npm packages with `bin` entries can be executed from the command line without an
`npm install` using a specifier in the following format:

```ts, ignore
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

For example:

```sh
$ deno run --allow-env --allow-read npm:cowsay@1.5.0 Hello there!
 ______________
< Hello there! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

$ deno run --allow-env --allow-read npm:cowsay@1.5.0/cowthink What to eat?
 ______________
( What to eat? )
 --------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## TypeScript types

Many packages ship with types out of the box, you can import those and use them
with types easily:

```ts, ignore
import chalk from "npm:chalk@5";
```

Some packages do not though, but you can specify their types with a
[`@deno-types`](../advanced/typescript/types.md) directive. For example, using a
[`@types`](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types)
package:

```ts, ignore
// @deno-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
```

### Including Node types

Node ships with many built-in types like `Buffer` that might be referenced in an
npm package's types. To load these you must add a types reference directive to
the `@types/node` package:

```ts, ignore
/// <reference types="npm:@types/node" />
```

Note that it is fine to not specify a version for this in most cases because
Deno will try to keep it in sync with its internal Node code, but you can always
override the version used if necessary.

## `--node-modules-dir` flag

npm specifiers resolve npm packages to a central global npm cache. This works
well in most cases and is ideal since it uses less space and doesn't require a
node_modules directory. That said, you may find cases where an npm package
expects itself to be executing from a `node_modules` directory. To improve
compatibility and support those packages, you can use the `--node-modules-dir`
flag.

For example, given `main.ts`:

```ts
import chalk from "npm:chalk@5";

console.log(chalk.green("Hello"));
```

Running this script with a `--node-modules-dir` like so...

```sh
deno run --node-modules-dir main.ts
```

...will create a `node_modules` folder in the current directory with a similar
folder structure to npm.

![](../images/node_modules_dir.png)

Note that this is all done automatically when calling deno run and there is no
separate install command necessary.

Alternatively, if you wish to disable the creation of a `node_modules` directory
entirely, you can set this flag to false (ex. `--node-modules-dir=false`) or add
a `"nodeModulesDir": false` entry to your deno.json configuration file to make
the setting apply to the entire directory tree.

In the case where you want to modify the contents of the `node_modules`
directory before execution, you can run `deno cache` with `--node-modules-dir`,
modify the contents, then run the script.

For example:

```sh
deno cache --node-modules-dir main.ts
deno run --allow-read=. --allow-write=. scripts/your_script_to_modify_node_modules_dir.ts
deno run --node-modules-dir main.ts
```

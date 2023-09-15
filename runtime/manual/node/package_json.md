# package.json compatibility

Deno supports resolving dependencies based on a `package.json` file in the
current or ancestor directories. This is similar to how Node.js resolves
dependencies. We recommend using import maps with `deno.json` which is explained
[here](../basics/import_maps.md).

```json title="package.json"
{
  "name": "@deno/my-example-project",
  "description": "An example app created with Deno",
  "type": "module",
  "scripts": {
    "dev": "deno run --allow-env --allow-sys main.ts"
  },
  "dependencies": {
    "chalk": "^5.2"
  }
}
```

```ts title="main.ts"
import chalk from "chalk";

console.log(chalk.green("Hello from Deno!"));
```

Then we can run this script:

```shell
> deno run --allow-env --allow-sys main.ts
Hello from Deno!
```

Or also execute package.json scripts via `deno task`:

```shell
> deno task dev
Hello from Deno!
```

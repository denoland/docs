---
title: "deno uninstall"
oldUrl: /runtime/manual/tools/uninstall/
command: uninstall
---

## `deno uninstall [PACKAGES]`

Remove dependencies specified in `deno.json` or `package.json` and uninstall them:

```shell
$ deno add npm:express
Add npm:express@5.0.0

$ cat deno.json
{
  "imports": {
    "express": "npm:express@5.0.0"
  }
}
```

```shell
$ deno uninstall express
Removed express

$ cat deno.json
{
  "imports": {}
}
```

:::tip

The [`deno remove`](/runtime/reference/cli/remove/) command will remove packages
from the configuration file, without uninstalling the packages.

:::

You can remove multiple dependencies at once:

```shell
$ deno add npm:express jsr:@std/http
Added npm:express@5.0.0
Added jsr:@std/http@1.0.7

$ cat deno.json
{
  "imports": {
    "@std/http": "jsr:@std/http@^1.0.7",
    "express": "npm:express@^5.0.0",
  }
}
```

```shell
$ deno remove express @std/http
Removed express
Removed @std/http

$ cat deno.json
{
  "imports": {}
}
```

If your project contains `package.json`, `deno uninstall` can work with it too:

```shell
$ cat package.json
{
  "dependencies": {
    "express": "^5.0.0"
  }
}

$ deno remove express
Removed express

$ cat package.json
{
  "dependencies": {}
}
```

## `deno uninstall --global [SCRIPT_NAME]`

Uninstall `serve`

```bash
deno uninstall --global serve
```

Uninstall `serve` from a specific installation root

```bash
deno uninstall -g --root /usr/local serve
```

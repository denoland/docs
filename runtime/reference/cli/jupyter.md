---
title: "Jupyter Kernel for Deno"
oldUrl: /runtime/reference/cli/jupyter/
---

Deno ships with a built-in Jupyter kernel that allows you to write JavaScript
and TypeScript; use Web and Deno APIs and import `npm` packages straight in your
interactive notebooks.

:::caution `deno jupyter` is currently unstable

`deno jupyter` is currently an unstable feature and thus requires the
`--unstable` flag. We intend to stabilize this feature in an upcoming release.

:::

## Quickstart

Run `deno jupyter --unstable` and follow the instructions.

You can run `deno jupyter --unstable --install` to force installation of the
kernel. Deno assumes that `jupyter` command is available in your `PATH`.

After completing the installation process, the Deno kernel will be available in
the notebook creation dialog in JupyterLab and the classic notebook:

![Jupyter notebook kernel selection](../images/jupyter_notebook.png)

You can use the Deno Jupyter kernel in any editor that supports Jupyter
notebooks.

### VS Code

- Install the
  [VSCode Jupyter extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
- When on a new or existing Notebook, click creating a new Jupyter Notebook
  select "Jupyter kernels" and then select Deno

![Selecting Deno in VS Code](https://github.com/denoland/deno-docs/assets/836375/32f0ccc3-35f7-47e5-84f4-17c20a5b5732)

### JetBrains IDEs

Jupyter Notebooks are available right out of the box.

## Rich content output

Deno Jupyter kernel allows you to display rich content in your notebooks
[using MIME types that Jupyter supports](https://docs.jupyter.org/en/latest/reference/mimetype.html).

To do that, you need to return any JavaScript object that has a
`[Symbol.for("Jupyter.display")]` method. This method should return a dictionary
mapping a MIME type to a value that should be displayed.

```ts
{
  [Symbol.for("Jupyter.display")]() {
    return {
      // Plain text content
      "text/plain": "Hello world!",

      // HTML output
      "text/html": "<h1>Hello world!</h1>",
    }
  }
}
```

Since it's _just_ a function, you can use any library you want to format the
output. This is not tied to Deno itself in any way, because we're using a
regular JavaScript symbol index.

## `jupyter console` integration

You can also use Deno Jupyter kernel in the `jupyter console` REPL. To do that,
you should launch your console with `jupyter console --kernel deno`.

![Using the Deno kernel in a CLI](../images/jupyter-cli.gif)

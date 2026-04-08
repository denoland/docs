---
last_modified: 2024-10-07
title: "deno lsp"
oldUrl: /runtime/manual/tools/lsp/
---

:::info

Usually humans do not use this subcommand directly. The 'deno lsp' can provide
IDEs with go-to-definition support and automatic code formatting.

:::

Starts the Deno language server. The language server is used by editors to
provide features like IntelliSense, code formatting, and more.

## Usage

```sh
deno lsp
```

The language server communicates over stdin/stdout using the
[Language Server Protocol](https://microsoft.github.io/language-server-protocol/).
You typically don't run this directly — your editor starts it automatically.

## Editor setup

For instructions on configuring your editor to use the Deno language server,
see:

- [Deno & VS Code](/runtime/reference/vscode/)
- [LSP integration](/runtime/reference/lsp_integration/) for other editors

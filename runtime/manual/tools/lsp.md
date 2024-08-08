---
title: "deno lsp"
---

:::info

Usually humans do not use this subcommand directly. For example, 'deno lsp' can
provide IDEs with go-to-definition support and automatic code formatting.

:::

Starts the Deno language server. The language server is used by editors to
provide features like intellisense, code formatting, and more.

## Command

`deno lsp [OPTIONS]`

## Synopsis

```bash
deno lsp [-q|--quiet]

deno lsp -h|--help
```

## Description

The 'deno lsp' subcommand provides a way for code editors and IDEs to interact
with Deno using the Language Server Protocol.

Read more about
[how to connect editors and IDEs to 'deno lsp'](https://deno.land/manual@v1.42.4/getting_started/setup_your_environment#editors-and-ides).

## Arguments

There are no required arguments for this command.

## Options

- `-q, --quiet`

  Suppress diagnostic output

- `-h, --help`

  Prints help information

---
title: "deno types"
oldUrl: /runtime/reference/cli/types/
---

Prints runtime TypeScript declarations.

## Command

`deno types [OPTIONS]` - Generate types into stdout.

## Synopsis

```bash
deno types [-q|--quiet] [OPTIONS]

deno types -h|--help
```

## Description

Generates types suitable for use with Deno runtime. The types are printed to
stdout and can be redirected to a file or used in a pipeline.

```bash
deno types > lib.deno.d.ts
```

## Arguments

There are no arguments for this command.

## Options

- `-q, --quiet`

  Suppress diagnostic output

- `-h, --help`

  Print help (see a summary with '-h')

## Examples

- Save Deno type definitions into a d.ts file

```bash
deno types > lib.deno.d.ts
```

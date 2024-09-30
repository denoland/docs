---
title: "deno eval"
oldUrl: /runtime/manual/tools/eval/
command: eval
---

## Description

Evaluate JavaScript from the command line.

```bash
deno eval "console.log('hello world')"
```

To evaluate as TypeScript:

```bash
deno eval --ext=ts "const v: string = 'hello'; console.log(v)"
```

This command has implicit access to all permissions (--allow-all).

## Examples

- Execute JavaScript

```bash
deno eval "console.log('hello world')"
```

- Execute TypeScript

```bash
deno eval --ext=ts "const v: string = 'hello'; console.log(v)"
```

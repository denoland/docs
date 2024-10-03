---
title: "`deno repl`, interactive scripting prompt"
oldUrl: /runtime/manual/tools/repl/
command: repl
---

## Special variables

The REPL provides a couple of special variables, that are always available:

| Identifier | Description                          |
| ---------- | ------------------------------------ |
| _          | Yields the last evaluated expression |
| _error     | Yields the last thrown error         |

```console
Deno 1.14.3
exit using ctrl+d or close()
> "hello world!"
"hello world!"
> _
"hello world!"
> const foo = "bar";
undefined
> _
undefined
```

## Special functions

The REPL provides several functions in the global scope:

| Function | Description                       |
| -------- | --------------------------------- |
| clear()  | Clears the entire terminal screen |
| close()  | Close the current REPL session    |

## `--eval` flag

`--eval` flag allows you to run some code in the runtime before you are dropped
into the REPL. This is useful for importing some code you commonly use in the
REPL, or modifying the runtime in some way:

```console
$ deno repl --allow-net --eval 'import { assert } from "jsr:@std/assert@1"'
Deno 1.45.3
exit using ctrl+d, ctrl+c, or close()
> assert(true)
undefined
> assert(false)
Uncaught AssertionError
    at assert (https://jsr.io/@std/assert/1.0.0/assert.ts:21:11)
    at <anonymous>:1:22
```

## `--eval-file` flag

`--eval-file` flag allows you to run code from specified files before you are
dropped into the REPL. Like the `--eval` flag, this is useful for importing code
you commonly use in the REPL, or modifying the runtime in some way.

Files can be specified as paths or URLs. URL files are cached and can be
reloaded via the `--reload` flag.

If `--eval` is also specified, then `--eval-file` files are run before the
`--eval` code.

```console
$ deno repl --eval-file=https://docs.deno.com/examples/welcome.ts,https://docs.deno.com/examples/local.ts
Download https://docs.deno.com/examples/welcome.ts
Welcome to Deno!
Download https://docs.deno.com/examples/local.ts
Deno 1.45.3
exit using ctrl+d or close()
> local // this variable is defined locally in local.ts, but not exported
"This is a local variable inside of local.ts"
```

### Relative Import Path Resolution

If `--eval-file` specifies a code file that contains relative imports, then the
runtime will try to resolve the imports relative to the current working
directory. It will not try to resolve them relative to the code file's location.
This can cause "Module not found" errors when `--eval-file` is used with module
files:

```console
$ deno repl --eval-file=https://jsr.io/@std/encoding/1.0.0/ascii85.ts
error in --eval-file file https://jsr.io/@std/encoding/1.0.0/ascii85.ts. Uncaught TypeError: Module not found "file:///home/_validate_binary_like.ts".
    at async <anonymous>:2:13
Deno 1.45.3
exit using ctrl+d or close()
>
```

## Tab completions

Tab completions are crucial feature for quick navigation in REPL. After hitting
`tab` key, Deno will now show a list of all possible completions.

```console
$ deno repl
Deno 1.45.3
exit using ctrl+d or close()
> Deno.read
readTextFile      readFile          readDirSync       readLinkSync      readAll           read
readTextFileSync  readFileSync      readDir           readLink          readAllSync       readSync
```

## Keyboard shortcuts

| Keystroke             | Action                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| Ctrl-A, Home          | Move cursor to the beginning of line                                                             |
| Ctrl-B, Left          | Move cursor one character left                                                                   |
| Ctrl-C                | Interrupt and cancel the current edit                                                            |
| Ctrl-D                | If if line _is_ empty, signal end of line                                                        |
| Ctrl-D, Del           | If line is _not_ empty, delete character under cursor                                            |
| Ctrl-E, End           | Move cursor to end of line                                                                       |
| Ctrl-F, Right         | Move cursor one character right                                                                  |
| Ctrl-H, Backspace     | Delete character before cursor                                                                   |
| Ctrl-I, Tab           | Next completion                                                                                  |
| Ctrl-J, Ctrl-M, Enter | Finish the line entry                                                                            |
| Ctrl-K                | Delete from cursor to end of line                                                                |
| Ctrl-L                | Clear screen                                                                                     |
| Ctrl-N, Down          | Next match from history                                                                          |
| Ctrl-P, Up            | Previous match from history                                                                      |
| Ctrl-R                | Reverse Search history (Ctrl-S forward, Ctrl-G cancel)                                           |
| Ctrl-T                | Transpose previous character with current character                                              |
| Ctrl-U                | Delete from start of line to cursor                                                              |
| Ctrl-V                | Insert any special character without performing its associated action                            |
| Ctrl-W                | Delete word leading up to cursor (using white space as a word boundary)                          |
| Ctrl-X Ctrl-U         | Undo                                                                                             |
| Ctrl-Y                | Paste from Yank buffer                                                                           |
| Ctrl-Y                | Paste from Yank buffer (Meta-Y to paste next yank instead)                                       |
| Ctrl-Z                | Suspend (Unix only)                                                                              |
| Ctrl-_                | Undo                                                                                             |
| Meta-0, 1, ..., -     | Specify the digit to the argument. `–` starts a negative argument.                               |
| Meta &lt;             | Move to first entry in history                                                                   |
| Meta &gt;             | Move to last entry in history                                                                    |
| Meta-B, Alt-Left      | Move cursor to previous word                                                                     |
| Meta-Backspace        | Kill from the start of the current word, or, if between words, to the start of the previous word |
| Meta-C                | Capitalize the current word                                                                      |
| Meta-D                | Delete forwards one word                                                                         |
| Meta-F, Alt-Right     | Move cursor to next word                                                                         |
| Meta-L                | Lower-case the next word                                                                         |
| Meta-T                | Transpose words                                                                                  |
| Meta-U                | Upper-case the next word                                                                         |
| Meta-Y                | See Ctrl-Y                                                                                       |
| Ctrl-S                | Insert a new line                                                                                |

## `DENO_REPL_HISTORY`

You can use `DENO_REPL_HISTORY` environmental variable to control where Deno
stores the REPL history file. You can set it to an empty value, Deno will not
store the history file.

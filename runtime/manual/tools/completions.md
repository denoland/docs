---
title: "deno completions"
---

Output shell completion script to standard output.

## Command

`deno completions [OPTIONS] <SHELL>` - Generate completion script for the
specified shell.

## Synopsis

```bash
deno completions [-q|--quiet] <SHELL>

deno completions -h|--help
```

## Description

The completions command generates a script to configure shell completion for
Deno. Executing the script will configure the shell to provide completion for
Deno commands and subcommands.

## Arguments

`SHELL`

Possible values: bash, fish, powershell, zsh, fig

## Options

- `-q, --quiet`

  Suppress diagnostic output

- `-h, --help`

  Print help (see a summary with '-h')

## Examples

- Configure Bash shell completion

```bash
deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
source /usr/local/etc/bash_completion.d/deno.bash
```

- Configure PowerShell shell completion

```bash
deno completions powershell | Out-String | Invoke-Expression
```

- Configure zsh shell completion

First add the following to your `.zshrc` file:

```bash
fpath=(~/.zsh/completion $fpath)
autoload -U compinit
compinit
```

Then run the following commands:

```bash
deno completions zsh > _deno
mv _deno ~/.zsh/completion/_deno
autoload -U compinit && compinit
```

- Configure fish shell completion

```bash
deno completions fish > completions.fish
chmod +x ./completions.fish
```

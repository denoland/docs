---
title: "deno completions"
oldUrl: /runtime/manual/tools/completions/
command: completions
---

## Examples

### Configure Bash shell completion

```bash
deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
source /usr/local/etc/bash_completion.d/deno.bash
```

### Configure PowerShell shell completion

```bash
deno completions powershell | Out-String | Invoke-Expression
```

### Configure zsh shell completion

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

### Configure fish shell completion

```bash
deno completions fish > completions.fish
chmod +x ./completions.fish
```

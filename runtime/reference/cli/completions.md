---
title: "deno completions"
oldUrl: /runtime/manual/tools/completions/
command: completions
---

You can use the output script to configure autocompletion for `deno` commands.
For example: `deno un` -> <kbd>Tab</kbd> -> `deno uninstall`.

## Examples

### Configure Bash shell completion

```bash
deno completions bash > deno.bash

if [ -d "/usr/local/etc/bash_completion.d/" ]; then
  sudo mv deno.bash /usr/local/etc/bash_completion.d/
  source /usr/local/etc/bash_completion.d/deno.bash
elif [ -d "/usr/share/bash-completion/completions/" ]; then
  sudo mv deno.bash /usr/share/bash-completion/completions/
  source /usr/share/bash-completion/completions/deno.bash
else
  echo "Please move deno.bash to the appropriate bash completions directory"
fi
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

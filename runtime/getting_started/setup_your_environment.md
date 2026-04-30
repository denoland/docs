---
last_modified: 2026-02-19
title: "Set up your environment"
description: "A guide to setting up your development environment for Deno. Learn how to configure VS Code, JetBrains, and other editors with Deno's built-in language server."
oldUrl: /runtime/manual/getting_started/setup_your_environment/
---

Deno includes a full
[language server (LSP)](/runtime/reference/cli/lsp/) that provides autocomplete,
go-to-definition, diagnostics, formatting, and more in your editor.

## Visual Studio Code

1. Install the
   [Deno extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
   from the Extensions panel.
2. Open the Command Palette (`Ctrl+Shift+P`) and run
   **Deno: Initialize Workspace Configuration**.

![The VSCode command palette with the Deno: Initialize Workspace Configuration option selected.](./images/vscode-setup.png)

This creates a `.vscode/settings.json` with:

```json
{
  "deno.enable": true
}
```

You now have IntelliSense, formatting, linting, and more powered by Deno's LSP.

## JetBrains IDEs

Install the official Deno plugin: **File > Settings > Plugins**, search for
"Deno".

Then enable it: **File > Settings > Languages & Frameworks > JavaScript
Runtime**, set **Preferred Runtime** to **Deno**.

See the
[JetBrains blog post](https://blog.jetbrains.com/webstorm/2020/06/deno-support-in-jetbrains-ides/)
for more details.

## Skills for AI assistants

Deno provides official **skills** — specialized knowledge packs that give AI
coding assistants (such as Claude, GitHub Copilot, Cursor, and others) accurate,
up-to-date knowledge of Deno's APIs, conventions, and best practices.

Without these skills, AI assistants may suggest Node.js-specific patterns or
outdated Deno APIs. Loading the relevant skill ensures the assistant understands
Deno's module system, standard library, `deno.json` configuration, Deno Deploy,
Fresh, and more.

Skills are available at
[github.com/denoland/skills](https://github.com/denoland/skills). Each skill is
a plain text or markdown file you can paste into your AI assistant's context,
add to a project-level instructions file (e.g. `CLAUDE.md`,
`.github/copilot-instructions.md`), or configure as a persistent system prompt —
depending on your tool.

Available skills include:

- **deno-guidance** — foundational Deno knowledge: module imports, `deno.json`,
  CLI commands, and package selection
- **deno-deploy** — deploying to Deno Deploy, KV, environment variables, and the
  `deno deploy` CLI
- **deno-frontend** — building web UIs with the Fresh framework and Preact
- **deno-expert** — advanced Deno patterns for code review and debugging
- **deno-sandbox** — executing untrusted code safely with `@deno/sandbox`

## Other editors

<details>
<summary>Vim / Neovim</summary>

### Neovim 0.6+ (built-in LSP)

Install [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/) and enable
the
[Deno configuration](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#denols).

If you also use `ts_ls`, set separate `root_markers` to avoid conflicts:

```lua
vim.lsp.config('denols', {
    on_attach = on_attach,
    root_markers = {"deno.json", "deno.jsonc"},
})

vim.lsp.config('ts_ls', {
    on_attach = on_attach,
    root_markers = {"package.json"},
    single_file_support = false,
})
```

#### Kickstart.nvim and Mason LSP

If you are using [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim)
add the configuration inside the servers table in your `init.lua`:

```lua
local servers = {
        -- ... some configuration
        ts_ls = {
            root_dir = require("lspconfig").util.root_pattern({ "package.json", "tsconfig.json" }),
            single_file_support = false,
            settings = {},
        },
        denols = {
            root_dir = require("lspconfig").util.root_pattern({"deno.json", "deno.jsonc"}),
            single_file_support = false,
            settings = {},
        },
    }
```

### coc.nvim

Install [coc.nvim](https://github.com/neoclide/coc.nvim/wiki/Install-coc.nvim),
then run `:CocInstall coc-deno` and `:CocCommand deno.initializeWorkspace`.

### ALE

[ALE](https://github.com/dense-analysis/ale) supports Deno out of the box. Run
`:help ale-typescript-deno` for configuration options.

### Vim-EasyComplete

Install
[vim-easycomplete](https://github.com/jayli/vim-easycomplete#installation), then
run `:InstallLspServer deno`.

### Vim-Lsp

After installing [vim-lsp](https://github.com/prabirshrestha/vim-lsp), add to
your `.vimrc`:

```vim
if executable('deno')
  let server_config = {
    \ 'name': 'deno',
    \ 'cmd': {server_info->['deno', 'lsp']},
    \ 'allowlist': ['typescript', 'javascript', 'javascriptreact', 'typescriptreact'],
    \ }

  if exists('$DENO_ENABLE')
    let deno_enabled = $DENO_ENABLE == '1'
    let server_config['workspace_config'] = { 'deno': { 'enable': deno_enabled ? v:true : v:false } }
  endif

  au User lsp_setup call lsp#register_server(server_config)
endif
```

You can enable the LSP by having a `deno.json`/`deno.jsonc` in your working
directory, or by setting `DENO_ENABLE=1`. For syntax highlighting in tooltips,
add:

```vim
let g:markdown_fenced_languages = ["ts=typescript"]
```

</details>

<details>
<summary>Emacs</summary>

### lsp-mode

Install [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/installation/) —
it supports Deno out of the box.
[Configuration options](https://emacs-lsp.github.io/lsp-mode/page/lsp-deno/).

### eglot

Use the built-in [`eglot`](https://github.com/joaotavora/eglot):

```elisp
(add-to-list 'eglot-server-programs '((js-mode typescript-mode) . (eglot-deno "deno" "lsp")))

  (defclass eglot-deno (eglot-lsp-server) ()
    :documentation "A custom class for deno lsp.")

  (cl-defmethod eglot-initialization-options ((server eglot-deno))
    "Passes through required deno initialization options"
    (list
      :enable t
      :unstable t
      :typescript
        (:inlayHints
          (:variableTypes
            (:enabled t))
          (:parameterTypes
            (:enabled t)))))
```

</details>

<details>
<summary>Sublime Text, Zed, Helix, Kakoune, Pulsar, Nova</summary>

### Sublime Text

Install the [LSP package](https://packagecontrol.io/packages/LSP) and
optionally the
[TypeScript package](https://packagecontrol.io/packages/TypeScript). Add to your
`.sublime-project`:

```jsonc
{
  "settings": {
    "LSP": {
      "deno": {
        "command": ["deno", "lsp"],
        "initializationOptions": {
          "enable": true,
          "lint": true,
          "unstable": false
        },
        "enabled": true,
        "languages": [
          {
            "languageId": "javascript",
            "scopes": ["source.js"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "javascriptreact",
            "scopes": ["source.jsx"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "typescript",
            "scopes": ["source.ts"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScript.tmLanguage",
              "Packages/TypeScript Syntax/TypeScript.tmLanguage"
            ]
          },
          {
            "languageId": "typescriptreact",
            "scopes": ["source.tsx"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScriptReact.tmLanguage",
              "Packages/TypeScript Syntax/TypeScriptReact.tmLanguage"
            ]
          }
        ]
      }
    }
  }
}
```

### Zed

Install the
[Deno extension](https://zed.dev/extensions?query=deno&filter=language-servers)
from the extensions panel.

### Helix

Add to your `languages.toml`:

```toml
[[language]]
name = "typescript"
roots = ["deno.json", "deno.jsonc", "package.json"]
file-types = ["ts", "tsx"]
auto-format = true
language-servers = ["deno-lsp"]

[[language]]
name = "javascript"
roots = ["deno.json", "deno.jsonc", "package.json"]
file-types = ["js", "jsx"]
auto-format = true
language-servers = ["deno-lsp"]

[language-server.deno-lsp]
command = "deno"
args = ["lsp"]
config.deno.enable = true
```

### Kakoune

Install [kak-lsp](https://github.com/kak-lsp/kak-lsp) and add to your
`kak-lsp.toml`:

```toml
[language.typescript]
filetypes = ["typescript", "javascript"]
roots = [".git"]
command = "deno"
args = ["lsp"]
[language.typescript.settings.deno]
enable = true
lint = true
```

### Pulsar

Install
[atom-ide-deno](https://web.pulsar-edit.dev/packages/atom-ide-deno) and
[atom-ide-base](https://web.pulsar-edit.dev/packages/atom-ide-base).

### Nova

Install the
[Deno extension](https://extensions.panic.com/extensions/co.gwil/co.gwil.deno/).

</details>

<details>
<summary>GitHub Codespaces</summary>

If the repository contains `.devcontainer` configuration, Deno will work
automatically. Otherwise, add the Deno dev container by selecting
**Codespaces: Add Development Container Configuration Files...** from the
command palette, then **Show All Definitions...**, and search for **Deno**.
Rebuild the container after selecting it.

</details>

## Shell completions

Generate shell completions for the Deno CLI:

```shell
deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
deno completions zsh > ~/.zsh/_deno
deno completions fish > ~/.config/fish/completions/deno.fish
deno completions powershell >> $profile
```

For zsh, ensure the completions directory is in your `fpath` in `~/.zshrc`:

```shell
fpath=(~/.zsh $fpath)
autoload -Uz compinit
compinit -u
```

### Dynamic completions

Use the `--dynamic` flag to enable completions that are context-aware, such as
listing available tasks for `deno task`:

```shell
deno completions --dynamic bash > /usr/local/etc/bash_completion.d/deno.bash
deno completions --dynamic zsh > ~/.zsh/_deno
deno completions --dynamic fish > ~/.config/fish/completions/deno.fish
deno completions --dynamic powershell >> $profile
```

With dynamic completions, typing `deno task <TAB>` will suggest the task names
from your project's `deno.json`.

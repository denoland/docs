---
title: "Hot module replacement"
description: "deno desktop --hmr keeps the runtime and rendering backend alive across edits — framework dev servers in framework projects, V8 hot-swap in everything else."
---

```sh
deno desktop --hmr .
```

`--hmr` enables hot module replacement during development. The mode is selected
automatically based on what your project looks like:

| Project type                      | HMR mechanism                              |
| --------------------------------- | ------------------------------------------ |
| Detected framework (Next.js etc.) | The framework's own dev server.            |
| Plain `Deno.serve()` script       | File watcher + `Debugger.setScriptSource`. |

In both modes the Deno runtime and the rendering backend (CEF, WebView, …) stay
alive across changes. There is no full restart, no webview teardown, no
reconnect.

## Framework HMR

When framework detection identifies your project (see
[Frameworks](/runtime/desktop/frameworks/)), `--hmr` runs the framework's own
dev server instead of its production server. The webview connects to that dev
server directly — fast refresh, state preservation, and error overlays all work
the same as in a browser tab.

```sh
deno desktop --hmr .       # in a Next.js / Astro / Fresh / … project
```

The dev server's exact behavior comes from the framework. If `next dev`
preserves component state across edits in a browser, it preserves it in your
desktop app too. If `astro dev` shows an in-page error overlay on a syntax
error, you see the same overlay.

You do not need to run the framework's dev script separately.
`deno
desktop --hmr` starts it as part of the desktop runtime.

## Plain-app HMR

For projects without a detected framework, `--hmr` watches your source files and
uses V8's `Debugger.setScriptSource` to hot-swap modules into the running
isolate.

```ts title="main.ts"
Deno.serve((req) => {
  return new Response("hello world");
});
```

```sh
deno desktop --hmr main.ts
```

Edit `main.ts` — change the response body, add a route — and the change applies
on save. The runtime does not restart, the webview does not reload, the
listening socket stays bound.

### What persists across reloads

`Debugger.setScriptSource` replaces the **code** of a function with new code.
Live values stay the same:

- Module-level state (top-level `let`, top-level `Map`, etc.) is preserved.
- Open file handles, network connections, child processes — all preserved.
- The HTTP listener is preserved.
- Timers and intervals keep firing on their original schedule unless you
  `clearTimeout` / `clearInterval` them.

### What changes on the next call

The replaced functions execute their new bodies the next time they are called.
So:

- A request handler change takes effect on the next request.
- A timer callback change takes effect on the next firing.
- An event listener change takes effect on the next event.

### What HMR cannot do

`Debugger.setScriptSource` has limits. It cannot replace:

- Top-level statements that have already executed (a `console.log` at module
  scope only runs when the module is first loaded).
- The signature of a class — adding fields, changing constructors. The class
  declaration is replaced; existing instances keep their old shape.
- The set of imports — adding a new `import` line requires a full reload.

When the change is too disruptive to apply incrementally, `--hmr` falls back to
a full reload of the affected module. If even that is not safe (for example,
top-level state would be lost in a way the runtime cannot recover from), it logs
a warning suggesting a full restart.

## Browser-side HMR

The webview is a browser. Browser HMR — fast refresh in React, Vue's HMR
runtime, etc. — runs entirely inside the rendering backend, talking to your dev
server. `deno desktop --hmr` does not interfere with it; if your framework wires
browser HMR up, it works as designed.

The Deno-side HMR described on this page is **separate** from browser HMR. The
two coexist:

- A change to a React component file → browser HMR applies it inside the
  webview.
- A change to your `Deno.serve()` handler or a binding implementation →
  Deno-side HMR applies it inside the runtime.

You almost never need to think about the split — both happen on save.

## Limitations and caveats

- `--hmr` is for development only. Do not ship a binary built with `--hmr`; the
  file watcher and inspector overhead are not appropriate for end users.
- Source maps are required for accurate line numbers in stack traces after a hot
  swap. They are emitted by default; do not disable them in your bundler config.
- HMR cooperates with `--inspect` (see [DevTools](/runtime/desktop/devtools/)).
  You can attach a debugger to a running `--hmr` session and step through
  newly-swapped code.

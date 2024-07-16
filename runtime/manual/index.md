---
title: "Deno Runtime Quick Start"
pagination_next: /runtime/manual/getting_started/first_steps/
oldUrl:
  - /manual/
  - /runtime/manual/introduction/
  - /runtime/
  - /manual/introduction/
---

[Deno](https://www.deno.com)
([/ˈdiːnoʊ/](http://ipa-reader.xyz/?text=%CB%88di%CB%90no%CA%8A), pronounced
`dee-no`) is an
[open source](https://github.com/denoland/deno/blob/main/LICENSE.md) JavaScript,
TypeScript, and WebAssembly runtime with secure defaults and a great developer
experience. It's built on [V8](https://v8.dev/),
[Rust](https://www.rust-lang.org/), and [Tokio](https://tokio.rs/).

Let's create and run your first Deno program in under five minutes.

## Install Deno

Install the Deno runtime on your system using one of the terminal commands
below.

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

[Additional installation options can be found here](./getting_started/installation.md).
After installation, you should have the `deno` executable available on your
system path.

## Create a simple web server

Create a [TypeScript](https://www.typescriptlang.org/) file called `server.ts`
and include the following code:

```ts title="server.ts"
Deno.serve((_request: Request) => {
  return new Response("Hello, world!");
});
```

The Deno runtime has [built-in APIs](./runtime/builtin_apis.md) for server-side
functionality like HTTP servers, in addition to APIs
[found in the browser](./runtime/web_platform_apis.md) like the `Request` and
`Response` objects from the
[`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

Start your server using the `deno` command:

```sh
deno run --allow-net server.ts
```

The Deno runtime is [secure by default](./runtime/permission_apis.md), so the
`--allow-net` flag is required to give your code network access to start an HTTP
server. Visit [localhost:8000](http://localhost:8000) to see your local server
running.

<details>
<summary>🚀 <b>Host your server on Deno Deploy (optional)</b></summary>

The Deno runtime is
[open source](https://github.com/denoland/deno/blob/main/LICENSE.md) and runs
[on just about any cloud](./advanced/deploying_deno/index.md). You can also run
Deno programs on [Deno Deploy](/deploy/manual). Here's how it works.

Install the [`deployctl` command line utility](/deploy/manual/deployctl):

```sh
deno install -Arf https://deno.land/x/deploy/deployctl.ts
```

Deploy your server with `deployctl`. If this is your first time using Deno
Deploy, you'll be prompted to sign in with a GitHub account:

```sh
deployctl deploy --include=./server.ts --entrypoint=./server.ts
```

In a few moments, your server should be available on a public URL, deployed
across 30+ datacenters worldwide.

</details>

## Next steps

We've only just scratched the surface of what's possible with the Deno runtime.
Here are a few topics you might want to explore next.

- [Take a tour of key Deno features](./getting_started/first_steps.md)
- [Learn how to use ECMAScript modules](./basics/modules/index.md)
- [Compatibility with Node.js and npm](./node/index.md)
- [Web platform APIs available in Deno](./runtime/web_platform_apis.md)
- [`Deno` namespace built-in APIs](./runtime/builtin_apis.md)
- [CLI command reference](./tools/index.md)
- [Getting help](./help.md)

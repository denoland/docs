---
last_modified: 2026-06-18
title: "Full-stack monorepo with a Node frontend and Deno backend"
description: "Build a monorepo where a Vite + React frontend running on Node shares TypeScript code with a Deno backend through a single workspace package."
url: /examples/fullstack_monorepo_tutorial/
---

A common setup is a frontend built with a Node-based toolchain like Vite next to
a Deno backend, with a package of shared code that both sides import. Deno
workspaces make this work without symlinks, build steps, or copying files: the
frontend, the backend, and the shared package are all members of one workspace,
and each imports the shared package by name.

In this tutorial we'll build exactly that:

- `shared/`: a package of TypeScript types and functions, used by both sides.
- `backend/`: a Deno HTTP server that imports `shared`.
- `frontend/`: a Vite + React app that runs on Node and also imports `shared`.

The end result is a single repository where a change to the shared types is
immediately visible, and type-checked, in both the frontend and the backend.

## Set up the workspace

Create the project directory and the three members:

```sh
mkdir fullstack-monorepo
cd fullstack-monorepo
mkdir shared backend frontend
```

The root `deno.json` lists the members and turns on a local `node_modules`
directory, which the Vite frontend needs:

```json title="deno.json"
{
  "workspace": ["./shared", "./backend", "./frontend"],
  "nodeModulesDir": "auto"
}
```

`nodeModulesDir: "auto"` is a root-only option: Deno installs npm dependencies
into a `node_modules` directory at the root, which is how Node tooling like Vite
expects to find its packages.

## Create the shared package

The shared package holds the code both sides depend on. Here it's a `Dinosaur`
type and a function that describes one. Give it a `name` and an `exports` entry
so other members can import it:

```json title="shared/deno.json"
{
  "name": "@acme/shared",
  "version": "0.1.0",
  "exports": "./mod.ts"
}
```

```ts title="shared/mod.ts"
export interface Dinosaur {
  name: string;
  diet: "herbivore" | "carnivore" | "omnivore";
}

export function describe(dino: Dinosaur): string {
  return `${dino.name} is a ${dino.diet}.`;
}
```

A single `deno.json` is all this package needs. Both a Deno member and a Node
member can import it, so there's no separate build or publish step.

## Create the Deno backend

The backend is a Deno member that imports `@acme/shared` by name and serves the
data over HTTP. Notice that it imports both the `Dinosaur` type and the
`describe` function from the shared package, with no relative path:

```json title="backend/deno.json"
{
  "name": "@acme/backend",
  "version": "0.1.0",
  "exports": "./main.ts",
  "tasks": {
    "dev": "deno run --allow-net main.ts"
  }
}
```

```ts title="backend/main.ts"
import { describe, type Dinosaur } from "@acme/shared";

const dinosaurs: Dinosaur[] = [
  { name: "Tyrannosaurus", diet: "carnivore" },
  { name: "Triceratops", diet: "herbivore" },
];

Deno.serve((req) => {
  const { pathname } = new URL(req.url);
  if (pathname === "/api/dinosaurs") {
    return Response.json(
      dinosaurs.map((d) => ({ ...d, summary: describe(d) })),
    );
  }
  return new Response("Not found", { status: 404 });
});
```

You can run it now with `deno task dev` from the `backend` directory, then visit
[http://localhost:8000/api/dinosaurs](http://localhost:8000/api/dinosaurs) to
see the JSON response.

## Create the Node frontend

The frontend is a Vite + React app. It's an npm-style member, so it uses a
`package.json` that declares its npm dependencies and lists the shared package
as a `workspace:*` dependency:

```json title="frontend/package.json"
{
  "name": "@acme/frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@acme/shared": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@deno/vite-plugin": "^2.0.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.0"
  }
}
```

Add a `deno.json` alongside it for the JSX and DOM compiler options, so that
`deno check` and your editor type-check the React code correctly:

```json title="frontend/deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

The Vite config uses the
[`@deno/vite-plugin`](https://github.com/denoland/deno-vite-plugin), which
teaches Vite to resolve modules the way Deno does. That's what lets the frontend
import `@acme/shared`, a workspace member, by name. It also proxies `/api`
requests to the backend during development:

```ts title="frontend/vite.config.ts"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [react(), deno()],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
```

Add the HTML entry point and the React app. The app imports the same `Dinosaur`
type and `describe` function from `@acme/shared` that the backend uses:

```html title="frontend/index.html"
<!DOCTYPE html>
<html>
  <head>
    <title>Dinosaurs</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```tsx title="frontend/src/main.tsx"
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { describe, type Dinosaur } from "@acme/shared";

function App() {
  const [dinos, setDinos] = useState<Dinosaur[]>([]);
  useEffect(() => {
    fetch("/api/dinosaurs").then((r) => r.json()).then(setDinos);
  }, []);
  return (
    <ul>
      {dinos.map((d) => <li key={d.name}>{describe(d)}</li>)}
    </ul>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Install and run

Install every member's dependencies in one step from the root:

```sh
deno install
```

Run the backend and the frontend in two terminals. From the `backend` directory:

```sh
deno task dev
```

From the `frontend` directory:

```sh
deno run -A npm:vite
```

Open the URL Vite prints (by default
[http://localhost:5173](http://localhost:5173)). The page fetches
`/api/dinosaurs`, which Vite proxies to the Deno backend, and renders each
dinosaur using the shared `describe` function. The same `describe` call runs on
the server to build the `summary` field and in the browser to render the list.

## Type-check across the workspace

Because all three members share one workspace, a single `deno check` from the
root type-checks the frontend, the backend, and the shared package together:

```sh
deno check
```

Change the `Dinosaur` type in `shared/mod.ts`, for example by adding a required
field, and `deno check` reports every place in both the frontend and the backend
that needs updating. The shared package is a single source of truth, and neither
side can drift out of sync with it.

## Next steps

You now have a monorepo where a Node frontend and a Deno backend share
type-checked code through one workspace package. From here you might:

- Add more shared modules, such as request and response schemas validated on
  both sides.
- Add `deno test` to the shared package so its logic is covered once for both
  consumers.
- Centralize npm versions across members with
  [catalogs](/runtime/fundamentals/workspaces/#centralized-dependency-versions-with-catalog).

For the full set of workspace options, including publishing and the `workspace:`
protocol, see [Workspaces and monorepos](/runtime/fundamentals/workspaces/) and
[Configure a monorepo with workspaces](/examples/workspaces_monorepo_tutorial/).

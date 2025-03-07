---
title: "Compatibility with Node & npm"
url: /examples/backward_compat_with_node_npm/
videoUrl: https://www.youtube.com/watch?v=QPLchkJ7eas&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=12
layout: video.tsx
---

## Video description

Explore how to integrate Deno into your existing Node.js projects seamlessly. In
this video, we'll use Node.js standard libraries and npm modules with simple
prefixes, maintain compatibility with CommonJS projects, and make use of Deno's
features like dependency installation, formatting, and linting. Make the
transition of your Node.js projects effortlessly without the need for major
rewrites.

## Transcript and code

Making the choice to use Deno does not mean that we can't take advantage of the
Node.js ecosystem. It also doesn't mean that we have to rebuild all of our
Node.js projects from scratch.

Using the features of the standard library, or the npm ecosystem, is as simple
as adding a prefix. If you want to learn more about the Node apis you can check
out [the Node API documentation](/api/node/).

Here's an example of Using Node's file system module with the promises API:

```typescript title="main.ts"
async function readFile() {
  try {
    const data = await fs.readFile("example.txt", "utf8");
    console.log(data);
  } catch (error) {
    console.error("Error reading file", error);
  }
}

readFile();
```

We read the file and we console log the data.

In node, we would import `fs` from `fs/promises` eg:

```typescript
import fs from "fs/promises";
```

In Deno, we just put the Node prefix in front of the import, eg:

```typescript
import fs from "node:fs/promises";
```

Then we run `deno main.ts` and opt into the "Running Deno with Node.js Built-in
read access".

If we run `deno main.ts` and allow
[read access](/runtime/fundamentals/security/) its going to read from the file.

Updating any imports in our apps to use this Node specifier will enable any code
using node.js built-ins.

Deno even supports CommonJS projects, which feels above and beyond I think
that's pretty cool!

What if we wanted to use an npm module, from say, Sentry, in our application.

We're going to use the **npm colon specifier** this time:

```typescript title="main.ts"
import * as Sentry from "npm:@sentry/node";

Sentry.init({ dsn: "https://example.com" });

function main() {
  try {
    throw new Error("This is an error");
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error caught", error);
  }
}
```

We'll run the command:

```sh
deno run main.ts
```

Which will ask for access to our home directory, and other places, and there we
go! We are capturing this error as well! This backwards compatibility is pretty
amazing.

Are you working on an existing Node.js project? Well with Deno 2 you can do that
too. You can use `deno install` to install dependencies you can `deno fmt` for
formatting you can `deno lint` for linting we can even run `deno lint --fix` to
fix any linting problems automatically.

And yes you can also run Deno directly, so for any of the scripts that are part
of a `package.json` just run `deno task` with the name of the script, eg:

```sh
deno task dev
```

We can use all of the code that we've written before without having to change it
or stretch it too much Deno just makes it work!

---
title: "Interoperability with Node.js"
url: /examples/interoperability_with_nodejs/
videoUrl: https://www.youtube.com/watch?v=mgX1ymfqPSQ&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=2
layout: video.tsx
---

## Video description

Deno gained lots of interpoperability capabilities at its v2.0 release. In this
video, we'll look at how to use Node.js built-in APIs, NPM modules, and JSR
packages.

## Transcript and examples

[Deno 2.0](https://deno.com/blog/v2) is here, and it's good. One of the most
amazing features of Deno is its interoperability with other platforms including
Node. For example, we can use the core Node.js built in APIs. All we have to do
is add this Node specifier here.

```ts
import { fs } from "node:fs/priomses";
```

Deno also supports the use of NPM modules. All you need to do is add the NPM
specifier with your import and you're good to go.

```ts
import { * } as Sentry from "npm:@sentry/node";
```

We can also take advantage of [JSR](https://jsr.io), an open source package
registry for TypeScript and JavaScript.

```ts
import OpenAI from "jsr:@openai/openai";
```

JSR works with Deno, of course, but also with Node.js. bun, and CloudFlare
workers. You can even install JSR packages into Vite and Next.js applications.

Deno also gives us
[import maps](https://docs.deno.com/runtime/fundamentals/modules/#differentiating-between-imports-or-importmap-in-deno.json-and---import-map-option),
which help us manage our dependencies. You can install a package from JSR. The
import will be added to the `deno.json`, and you can even use a shorthand to
describe this to clean up your code even more. Deno 2.0 is focused on a really
solid developer experience. New projects and migrations feel a whole lot easier
with Deno.

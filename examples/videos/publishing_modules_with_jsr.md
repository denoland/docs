---
title: "Publishing Modules with JSR"
url: /examples/publishing_modules_with_jsr/
videoUrl: https://www.youtube.com/watch?v=7uiL4WYvZVs&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=8
layout: video.tsx
---

## Transcript and examples

[JSR](https://jsr.io) is a registry specifically designed for modern JavaScript
projects. JSR - the JavaScript registry - has a bunch of cool features. But if
you've used npm before, you might be thinking, "why do I need this and why do I
need to learn another one of these?"

- Well, first it's optimized for TypeScript.
- JSR only supports ES Modules.
- And finally, npm is the centralized registry for node projects, but there are
  other runtimes. Obviously Deno, but you can also use these packages in Bun,
  Cloudflare workers and more

Think of it like a superset. JSR doesn't replace npm, it builds on top of it.

So here at [jsr.io](https://jsr.io), you can search for whatever you want. I'm
looking for this library called Oak that is a middleware framework for handling
HTTP requests. I'll search for it here, and this will take me to
[the documentation page](https://jsr.io/@oak/oak).

If you want to install a package, all you need to do is add it:

```
deno add jsr:@oak/oak
```

Then we can use it inside of our file like this.

```javascript
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const router = new Router();
router.get("/", (context) => {
  context.response.body = "HEY!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
```

Pretty cool! But what is it like to publish our own JSR package? It's actually
great.

JSR packages can depend on other packages from JSR but also on any npm package.

Let's build a small library and publish it to JSR. Remember
[our `sing` function from earlier](/examples/all-in-one_tooling/), let's make
this a function that can be consumed by other people in the JavaScript
community. You're welcome everyone.

```typescript
export function sing(
  phrase: string,
  times: number,
): string {
  return Array(times).fill(phrase).join(" ");
}

sing("la", 3);
```

Now if we [head over to jsr.io, we can publish it](https://jsr.io/new). The
first time I ever try to publish a package, JSR will ask me which scope I want
to publish to. I can create that here.

Then I'll create the package name and follow the instructions.

Let's try using our new packaga in a project using Vite. The following command
will walk us through setting up a new Vite project.

```shell
deno run --allow-read --allow-write --allow-env npm:create-vite-extra@latest
```

Now we can import our new package by adding it to our project:

```shell
deno add jsr:@eveporcello/sing
```

And then importing it when we need it

```typescript
import { sing } from "@eveporcello/sing";
```

 So if I had to give myself a grade on this, I don't even have to give myself a
grade. [JSR will give me a grade](https://jsr.io/@eveporcello/sing/score) of
29%, which I don't know. Probably not so good. But this has a whole list of
improvements that I can make.

I need to add a readme to my package. I need to add examples. All of these
different things. So I can on my own time develop this to ensure that I have 100
percent here so that my code is well documented and very consumable by other
developers.

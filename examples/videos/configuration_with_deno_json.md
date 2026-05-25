---
title: "Configuration with Deno JSON"
url: /examples/configuration_with_deno_json/
videoUrl: https://www.youtube.com/watch?v=bTmO5Tfgke4
layout: video.tsx
---

## Video description

In this video, we use the deno.json file to manage dependencies and
configurations in your Deno projects. Learn how to create and configure tasks
like 'start' and 'format' to streamline your workflow. We'll also explore
customizing formatting and linting rules, and understand the concept of import
maps for cleaner imports. Then we'll take a look at compatibility between Deno's
deno.json and Node's package.json for seamless project integration.

## Transcript and code

### Introduction to JSR Package Management

Every time we’ve installed a package with JSR it’s been placed into this
`deno.json` file as an import.

```json title="deno.json"
{
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

### Creating and Running Tasks

So, we can use this file to manage our dependencies, but we can also use it for
a bunch of other configuration tasks. Specifically, to get us started, let’s
configure some literal tasks. We’re going to create a `"start"` task. This will
run `deno --allow-net main.ts`.

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts"
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

So, think of this like a shortcut for running a command. So we could say

```sh
deno task start
```

This is going to run that, same with

```sh
deno run start
```

that will work as well.

Let’s add another one of these, we’re going to call it `"format"`. So, this will
combine these two different things, we’ll say `deno fmt && deno lint`.

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

So let’s run

```sh
deno task format
```

and then this will run everything for us.

### Formatting and Linting Configuration

You can also use this file to set configurations for these types of commands. So
we can say `"fmt"` and then use a couple different rules, so the Formatting in
the documentation [here](/runtime/fundamentals/configuration/#formatting) will
walk you through it. There’s several different options that you can take
advantage of, let’s go ahead and say, `"useTabs"`, and we’ll say `true` here,
and then we’ll use `”lineWidth”: 80`.

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

Now if we run

```sh
deno task format
```

This will run everything with those rules.

Linting, you could set up as well. So we’ll say `"lint"`. This is also in the
documentation, right above this, so Linting
[here](/runtime/fundamentals/configuration/#linting) will take you on the
journey of all the different configuration options depending on your project’s
needs, but in this case let’s add a key for `"rules"` here, and you can include
them, you can exclude them.

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "lint": {
    "rules": {}
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

Let’s say `// @ts-ignore`, and we won’t add any comments after it.

```typescript title="main.ts"
// @ts-ignore
import { sing } from "jsr:@eveporcello/sing";

console.log(sing("sun", 3));
```

What this rule does is prevent you from silencing TypeScript errors by dropping
a // @ts-ignore or similar comment at the top of a file. In other words, you
can’t just tell TypeScript to ignore type checking in a file without explicitly
justifying it. That’s the intended behavior: if you’re bypassing the type
system, you should have to explain why.

However, when you run

```sh
deno task format
```

Deno will enforce this rule and complain if it finds ignored TypeScript checks
without an accompanying comment. If you really do want to allow this behavior
anyway, you can opt out of the rule entirely by disabling it in your
configuration. We’ll say `”exclude”: [“ban-ts-comment”]`.

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "lint": {
    "rules": {
      "exclude": ["ban-ts-comment"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

Then, we’ll try to run

```sh
deno task format
```

again. We should see that that runs appropriately and we’re getting away with
our `// @ts-ignore`.

### Handling Import Maps

There’s also a concept in this `deno.json` file of the import map. So, right now
we’re using `"@eveporcello/sing"` as the import, but it’s also possible to make
this a little bit shorter. We could use just `"sing"` for this.

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "lint": {
    "rules": {
      "exclude": ["ban-ts-comment"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80
  },
  "imports": {
    "sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

Now if we replace this whole thing with just `"sing"`

```typescript title="main.ts"
// @ts-ignore
import { sing } from "sing";

console.log(sing("sun", 3));
```

and we run

```sh
deno main.ts
```

This should work as expected. So this is what’s called a “bare specifier”. It’s
an import map which is going to map this particular dependency to this JSR
package, so it just allows for a nice, clean import if we’d like to.

If you want to learn more about these different options, check out the docs
[here](/runtime/fundamentals/configuration/) on configuration. Deno also
supports a `package.json` for compatibility with Node.js projects. Now, if both
a `deno.json` and a `package.json` are both found in the same directory, Deno
will understand the dependencies specified in both. So, a lot of options here,
but this is going to be extremely useful as you work on your Deno projects.

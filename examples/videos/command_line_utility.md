---
title: "Build a Command Line Utility"
url: /examples/command_line_utility/
videoUrl: https://www.youtube.com/watch?v=TUxj2TS5pNo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=14
layout: video.tsx
description: Use Deno to build a cross-platform CLI in TypeScript. Show command and argument parsing, and compiling for multiple desktop platforms.
---

## Description of video

Use Deno to build a cross-platform CLI in TypeScript. Show command and argument
parsing, and compiling for multiple desktop platforms.

## Transcript and code examples

If we want to create a command line tool, we can use
[Deno’s standard library](https://jsr.io/@std/cli). There are dozens of stable
libraries with helpful utility functions that can cover a lot of the basics when
working with JavaScript and the web.

The standard library also works in multiple runtimes and environments, like
Node.js and the browser.

So we’re going to create a command line tool, then we’ll compile it so it can be
used on a number of different platforms as an executable.

As a reminder, we can always reference command line arguments on the global.

```ts
const location = Deno.args[0];
console.log(`Welcome to ${location}`);

// run with `deno main.ts Chamonix`
```

Install std/cli: `deno add jsr:@std/cli`

That will add that to our `deno.json` file.

```ts
import { parseArgs } from "jsr:@std/cli/parse-args";
const args = parseArgs(Deno.args);
console.log(args);

// run with `deno main.ts Chamonix`
```

Our app is going to be a ski resort information app, and we’re going to populate
our app with a little bit of data to start.

```ts
const resorts = {
  Whistler: {
    elevation: 2214,
    snow: "Powder",
    expectedSnowfall: 20,
  },
  Aspen: {
    elevation: 7945,
    snow: "Packed Powder",
    expectedSnowfall: 15,
  },
  Vail: {
    elevation: 8120,
    snow: "Powder",
    expectedSnowfall: 25,
  },
  Crystal: {
    elevation: 4400,
    snow: "Packed Powder",
    expectedSnowfall: 10,
  },
};
```

So we ultimately want to be able to run the app with a command line argument
that provides the resort name and have it return the information. To do this,
we’ll need to parse arguments from the command line:

```ts
const args = parseArgs(Deno.args, {
  alias: {
    resort: "r",
  },
  default: {
    resort: "Whistler",
  },
});

const resortName = args.resort;
const resort = resorts[resortName];

// Now let's log those details
console.log(`
  Resort: ${resortName}
  Elevation: ${resort.elevation} feet
  Snow Conditions: ${resort.snow}
  Expected Snowfall: ${resort.expectedSnowfall}
`);
```

Try with Aspen, nothing, Schweitzer.

Add error handling for anything other than the resort list:

```ts
if (!resort) {
  console.error(
    `Resort ${resortName} not found. Try Whistler, Aspen, Vail, or Crystal.`,
  );
  Deno.exit(1);
}
```

Next we'll:

- Show the type error.
- Fix the type error.
- Extract the value of `args.resort`.
- Assert that there is a valid key in the data.

```ts
const resortName = args.resort as keyof typeof resorts;
```

It also might be nice to create a little help utility:

```ts
if (args.help) {
  console.log(`
    Usage: ski-cli --resort <resort name>
    -h, --help       Show help
    -r, --resort     Name of the ski resort (default: Whistler)
  `);
  Deno.exit(0);
}
```

We’ll also adjust the alias:

```ts
const args = parseArgs(Deno.args, {
  alias: {
    help: "h",
    resort: "r",
  },
  default: {
    resort: "Whistler",
  },
});
```

I’m feeling pretty good about this! And I want others to enjoy the app too. With
Deno, compiling this tool into an executable is pretty easy. As you might
imagine, the command for running this is Deno compile!

To test run: `./ski-li --resort Aspen`

This is great for me. But what happens when you want to share this to other
platforms?

```shell
deno compile --target x86_64-pc-windows-msvc --output ski-li-windows main.ts
deno compile --target x86_64-apple-darwin --output ski-li-macos main.ts
deno compile --target x86_64-unknown-linux-gnu --output ski-li-linux main.ts
```

To see all of the options for compiling your apps, you can check out the
documentation for
[Deno Compile](https://docs.deno.com/runtime/reference/cli/compiler/) — There
are a lot of flags for your own specific usecases.

Ok! So to recap, we always have access to args on the Deno global namespace. We
can parse these arguments using the parse arguments function from the standard
library CLI package. And we can run a compile for all platforms so that our app
can be consumed anywhere.

## Complete code sample

```ts
import { parseArgs } from "jsr:@std/cli/parse-args";

const resorts = {
  Whistler: {
    elevation: 2214,
    snow: "Powder",
    expectedSnowfall: "20",
  },
  Aspen: {
    elevation: 7945,
    snow: "Packed Powder",
    expectedSnowfall: "15",
  },
  Vail: {
    elevation: 8120,
    snow: "Powder",
    expectedSnowfall: "25",
  },
};

const args = parseArgs(Deno.args, {
  alias: {
    resort: "r",
    help: "h",
  },
  default: {
    resort: "Whistler",
  },
});

const resortName = args.resort as keyof typeof resorts;
const resort = resorts[resortName];

if (!resort) {
  console.error(
    `Resort ${resortName} not found. Try Whistler, Aspen, or Vail`,
  );
  Deno.exit(1);
}

if (args.help) {
  console.log(`
    usage: ski-cli --resort <resort name>
    -h, --help    Show Help
    -r, --resort  Name of the ski resort (default: Whistler)    
    `);
  Deno.exit(0);
}

console.log(
  `%c
    Resort: ${resortName}
    Elevation: ${resort.elevation} feet
    Snow Conditions: ${resort.snow}
    Expected Snowfall: ${resort.expectedSnowfall}    
`,
  "color: blue",
);
```

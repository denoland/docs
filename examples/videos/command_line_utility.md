---
title: "Build a Command Line Utility"
url: /examples/command_line_utility/
videoUrl: https://www.youtube.com/watch?v=TUxj2TS5pNo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=14
layout: video.tsx
---

## Video description

Learn to build a command line tool using Deno's standard library. You'll explore
how to parse arguments, handle flags, and provide helpful messages using utility
functions. Follow along as we build a ski resort information app, handle errors
gracefully, and compile the script into an executable for multiple platforms,
including Windows, MacOS, and Linux. By the end of this video, you'll understand
how to take full advantage of Deno's features to develop and distribute your own
CLI tools.

## Transcript and code

### An introduction to Deno's Standard Library

If you want to create a command line tool you can do so with
[Deno's standard Library](https://docs.deno.com/runtime/fundamentals/standard_library/).
It contains dozens of stable libraries with helpful utility functions that can
cover a lot of the basics when working with JavaScript in the web. The standard
Library also works in multiple runtimes and environments like Node.js and the
browser.

### Setting up a command line tool

We're going to create a commandline tool, and then we're going to compile it so
it can be used on a number of different platforms as an executable.

Create a new file called `main.ts` and parse these arguments (remember we can
always grab them from `Deno.args`), and then we'll console log them:

```typescript title="main.ts"
const location = Deno.args[0];

console.log(`Welcome to ${location}`);
```

Now if I run `deno main.ts` and then I provide the name of a ski resort like
Aspen that's going to plug that into the string, eg:

```sh
deno main.ts Aspen
## Welcome to Aspen
```

### Installing and Using Standard Libraries

Now lets install one of those standard libraries. In the terminal run:

```sh
deno add jsr:@std/cli
```

This is going to install the [cli library](https://jsr.io/@std/cli), from the
Deno standard library, into our project so we could make use of some of their
helpful functions.

The Helpful function that we'll use here is called `parseArgs`. We can import
that with:

```typescript
import { parseArgs } from "jsr:@std/cli/parse-args";
```

Then we can update our code to use this function, passing the argument and
removing the zero. Our `main.ts` file now looks like this:

```typescript title="main.ts"
import { parseArgs } from "jsr:@std/cli/parse-args";

const args = parseArgs(Deno.args);

console.log(args);
```

Let's go ahead and try this out, in your terminal run:

```sh
deno main.ts -h Hello
```

We can see that `Hello` has been added to our args object. All right, so that's
working as expected.

### Building the Ski Resort Information App

Now our app is going to be a ski resort information app, so we want to populate
our app with a little bit of data to start. We're going to create a value called
`resorts`. This is an object with a few different keys so we'll say `elevation`,
`snow` and `expectedSnowfall`. Then let's just copy and paste these so that we
can move a little more quickly we'll set `Aspen` to `7945` `snow` to
`packed powder`, `expectedSnowfall` to `15`. Then let's add one more of these
we'll set `Vail` to `8120` and then we'll say `expectedSnowfall` is `25`.

```typescript title="main.ts"
const resorts = {
  Whistler: {
    elevation: 2214,
    snow: "Powder",
    expectedSnowfall: "20",
  },

  Aspen: {
    elevation: 7945,
    snow: "packed powder",
    expectedSnowfall: 15,
  },
  Vail: {
    elevation: 8120,
    snow: "packed powder",
    expectedSnowfall: 25,
  },
};
```

We have a few different resorts here. Ultimately we want to be able to run our
app with a command line argument that's going to provide the resort name and
then have that CLI tool return the information about that resort.

### Handling Command Line Arguments

So let's go ahead and pass another object to parse args, here we're going to
define an alias - so we're going to say "if I pass the `r` flag we want to have
it assume it means `resort`. Then let's also use the default here, we'll set the
`default` `resort` to `Whistler`:

```typescript title="main.ts"
const args = parseArgs(Deno.args, {
  alias: {
    resort: "r",
  },
  default: {
    resort: "Whistler",
  },
});
```

From here we can set up a const called `resortName` and set it to `args.resort`.
Then get the resort, with `resorts[resortName]` (we'll fix that type error in a
second), and update the console log:

```typescript title="main.ts"
const resortName = args.resort;
const resort = resorts[resortName];

console.log(
  `Resort: ${resortName} Elevation: ${resort.elevation} feet Snow: ${resort.snow} Expected Snowfall: ${resort.expectedSnowfall}`,
);
```

To test this out we can use:

```sh
deno main.ts -r Aspen
```

Which will give us a printout of all of Aspen's details.

We can also run this without any arguments which should give the details for
Whistler, because that was set as default:

```sh
deno main.ts
```

Same goes for our full name, so we could say:

```sh
deno main.ts --resort Veil
```

And that should give us those details as well.

### Improving Error Handling

Now if I tried to run this with a resort that's not there, let's say `Bachelor`;
there's an error so that's kind of an ugly one. It's hitting this moment where
it's trying to parse that out and it can't find it. So we could make this a
little nicer by saying if there's no `resort` in our data set that matches the
input, let's run a console error saying
`resort name not found, try Whistler Aspen or Veil` and then we'll hop out of
that process with a `Deno.exit`:

```typescript title="main.ts"
if (!resort) {
  console.error(
    `Resort ${resortName} name not found. Try Whistler, Aspen, or Veil`,
  );
  Deno.exit(1);
}
```

### Fixing the types

Okay so this here isn't looking so good we can look at the problems here in
typescript - it's telling us that this implicitly has an `any` type, you can
look up more about this error but I'll show you how to fix this one. Update the
type of `resortName` to be a key of `resorts`:

```typescript title="main.ts"
const resortName = args.resort as keyof typeof resorts;
```

What this has done is extract the value of `args.resort` and it's going to
assert that there is a valid key inside of the data.

### Adding Help and Color Output

Let's take this one more step, we're going to say if `args.help`, we will
console log and then we're going to give our users a little message to say "hey
this is actually how you use this" if they do happen to ask for help at any
moment, and we'll update the alias here to say `help` is `H`, finally we'll make
sure to call `Deno.exit` so that we jump out of the process as soon as we're
done with that:

```typescript title="main.ts"
const args = parseArgs(Deno.args, {
  alias: {
    resort: "r",
    help: "h",
  },
  default: {
    resort: "Whistler",
  },
});

...

if (args.help) {
  console.log(`
    usage: ski-cli --resort <resort name>
    -h, --help    Show Help
    -r, --resort  Name of the ski resort (default: Whistler)
  `);
  Deno.exit();
}
```

You can test your help setup by running the following:

```sh
deno main.ts -h
```

Next let's log our results here in color. Deno has support for CSS using the
`%C` syntax.

This will take the text and apply the style that we pass in as the second
argument to the `console.log()`. Here we could set `color:blue` as the second
argument, eg:

````typescript title="main.ts"
console.log(`
    %c
    Resort: ${resortName} 
    Elevation: ${resort.elevation} feet 
    Snow: ${resort.snow} 
    Expected Snowfall: ${resort.expectedSnowfall}
    `, "color:blue"
);

Then run the program again:

```sh
deno main.ts -r Veil
````

You should see everything logged in a blue color. How cool is that?!

### Compiling the Tool for Different Platforms

I want other people to be able to enjoy the app too. Compiling this tool into an
executable is pretty easy with Deno. As you might imagine, the command for
running this is `deno compile` and then the name of our script. This is going to
compile the code to the project as an executable:

```sh
deno compile main.ts
```

You should see the executable in your project folder called MyDenoProject. Now
you can run this as an executable with `./`, eg:

```sh
./MyDenoProject --resort Aspen
```

So this is really great for me, but what happens if I want to share this to
other platforms? All you would need to do is run `deno compile` again, this time
passing in a `--target` flag for where you want to compile to.

Let's say we wanted to compile it for Windows we'd use:

```sh
deno compile --target x86_64-pc-windows-msvc --output ski-cli-windows main.ts
```

or for a Mac:

```sh
deno compile --target x86_64-apple-darwin --output ski-cli-macos main.ts
```

or for Linux:

```sh
deno compile --target x86_64-unknown-linux-gnu --output ski-cli-linux main.ts
```

You can see all of the
[options for compiling your apps](/runtime/reference/cli/compile/) in the Deno
documentation. There are a lot of different flags that you can use for your own
specific use cases.

To recap we always have access to the Deno Standard Library that we can take
advantage of with all these different helpful functions. If we wanted to create
a command line utility, like we've done here, we always have access to the
[`Deno` global namespace](/api/deno/~/Deno) for these arguments. We can parse
the arguments using the parse args function from the standard Library CLI
package and we can run a compile for all platforms so that our app can be
consumed anywhere.

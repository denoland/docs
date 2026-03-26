---
title: "Introduction to Deno APIs"
url: /examples/intro_to_deno_apis/
videoUrl: https://www.youtube.com/watch?v=p28ujFMrdA0&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=7
layout: video.tsx
---

## Video description

In this video, we explore the powerful APIs provided by Deno in the global
namespace. We demonstrate file system operations like creating, reading,
writing, and appending to files using Deno's built-in methods. Then, examine how
to handle command line arguments, environment variables, and set up a basic
server. We can reduce the need for external APIs with these Deno built-in APIs.

## Transcript and examples

In the global name space, Deno has a ton of APIs that you can take advantage of.
Let's take a look at a few of them.

### Creating and writing to files

In order to write a file, first we will await Deno.open and we'll pass in the
name of the file that we want to create. The second argument is going to be an
object where we'll set `read`, `write` and `create` to `true`:

```ts title="main.ts"
await Deno.open("thoughts.txt", {
  read: true,
  write: true,
  create: true,
});
```

To run this, we will use:

```sh
deno main.ts
```

When run, the console will prompt us to allow read access, so we'll say yes (or
`y`). Then it's going to ask us for write access, which is pretty cool (and
we'll allow that too with `y`), so we've granted both and now we have created a
file called `thoughts.txt`.

If we wanted to write some data to this file we could make some adjustments to
our `main.ts` file. Let's create a variable for our file (called file), then
we're going to add `append:true` to the object we pass to the `Deno.open` method
(we can also get rid of create I suppose, since the file has already been
created):

```ts title="main.ts"
const file = await Deno.open("thoughts.txt", {
  read: true,
  write: true,
  append: true,
});
```

Next, below this, we'll make a constant called `encoder`, and make it equal a
new text encoder. Then we'll make a second constant called `data`, which will
call `encode`. Finally we'll add a string with a newline and some text to
`data`:

```ts title="main.ts"
const encoder = new TextEncoder();
const data = encoder.encode("\nI think basil is underrated.");
```

Then we'll `await file.Write(data)`, which will take that data and write it to
the thoughts file, and finally we'll close the file.

```ts title=main.ts"
await file.write(data);
file.close();
```

This time we will run the file with the required permissions:

```sh
deno --allow-read --allow-write main.ts
```

If we take a look back at our `thoughts.txt` file it will say "I think basil is
underrated". The text has been appended to our file.

### Reading and appending to files

There are some other options as well, so let's go back to the top of our file
this time instead of using `Deno.open` we'll use `Deno.readFile`. Which means we
can remove the second argument object, because we're being very specific about
what we actually want to do here. Then we'll console log the file.

```ts title="main.ts"
const file = await Deno.readFile("thoughts.txt");
console.log(file);
```

If we run this with:

```sh
deno --allow-read main.ts
```

The encoded file will be logged to the console, which isn't quite what I want. I
actually want the human readable text. So what I can do here is I can use
`Deno.readTextFile` instead of `Deno.readFile`, which will write the text from
the file directly to the console.

We can also write to the file with `Deno.writeTextFile`. For example:

```ts title="main.ts"
await Deno.writeTextFile(
  "thoughts.txt",
  "Fall is a great season",
);
```

Which, if we run with `deno --allow-write main.ts`, will overwrite the contents
of the `thoughts.txt` file with the string about fall.

We can update that code to use `append: true`:

```ts title="main.ts"
await Deno.writeTextFile(
  "thoughts.txt",
  "\nWinter is the most fun season!",
  { append: true },
);
```

If we run it again, with `deno --allow-write main.ts`, it's going to append the
second sentence to the end of the file.

### Exploring command line arguments

We also have the option to explore command line arguments, so we could say:

```ts title="main.ts"
const name = Deno.args[0];
console.log(name);
```

We can run this with our usual deno command, but this time pass in a commandline
argument, lets say `Eve`:

```sh
deno main.ts Eve
```

The name `Eve` will be logged to the console.

If we want to get fancy, we can update the logged template string to pass out a
message:

```ts title="main.ts"
const name = Deno.args[0];
console.log(`How are you today, ${name}?`);
```

## Using env variables

On the Deno global, we also have environment variables. Let's create one called
`home`, and log our home directory to the console:

```ts title="main.ts"
const home = Deno.env.get("HOME");
console.log(`Home directory: ${home}`);
```

When run with `deno main.ts`, Deno will request environment access, which we can
allow with `y`. Or we can run the command with the `--allow-env` flag, and our
home directory will be logged to the console.

### Setting up a simple HTTP server

Finally, lets look at our trusty `server` constructor. We can create a handler
that returns a response, and then pass that handler to the `Deno.serve` method.

```ts title="main.ts"
function handler(): Response {
  return new Response("It's happening!");
}

Deno.serve(handler);
```

When run with

```sh
deno --allow-net main.ts
```

We'll see that a server is running and listening on port 8000. We can visit
`localhost:8000` in the browser and we should see the text "It's happening!".

So there are a ton of these that you can take advantage of but it's very nice to
know that we don't have to include an external library for everything, Deno has
us covered when it comes to managing errors handling servers and working with
the file system.

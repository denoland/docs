---
title: "All-in-one tooling"
url: /examples/all-in-one_tooling/
videoUrl: https://www.youtube.com/watch?v=-4e9DkUrCr4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=5
layout: video.tsx
---

## Description of video

In Node.js, before we can get started working on our project, we have to go
through a configuration step for things like linting, formatting, and testing.
Deno saves us a ton of time by including these tools natively. Let's take a look
at what's included with these built-in CLI tools.

## Transcript and code

Here we have a function called sing:

```javascript
function sing(phrase: string, times: number): string {
  return Array(times).fill(phrase).join(" ");
}
```

Now let's run the formatter:

```shell
deno fmt
```

The formatter automatically formats your code to follow Deno's rules and
conventions. Let's run it to clean up any formatting issues.

Deno even formats code snippets in markdown files. So anything that is enclosed
in triple backticks will be formatted when you run this command as well.

The deno lint command is used to analyze your code for potential issues. It’s
similar to ESLint but built into Deno.

```shell
deno lint --help
```

This will lint all of the JavaScript and TypeScript files in the current
directory and in subdirectories.

You can also lint specific files by passing their names

```shell
# lint specific files
deno lint myfile1.ts myfile2.ts
```

You can run it on specific directories

```shell
deno lint src/
```

And if you're feeling like you want to skip linting certain files, at the top of
the files, you can add a comment, and deno will know to skip this one.

```javascript
// deno-lint-ignore-file
// deno-lint-ignore-file -- reason for ignoring
```

Deno also has some CLI commands for testing. In our directory here we have a
test file. It uses the name of the function and test.

```javascript title="sing_test.ts"
import { sing } from "./sing.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("sing repeats a phrase", () => {
  const result = sing("La", 3);
  assertEquals(result, "La La La");
});
```

Now, we’ll run our tests using the deno test command. Deno automatically
discovers and runs test files.

```shell
deno test
```

The way Deno decides which files should be considered test files is that it
follows:

`_test.ts`, `_test.js`, `_test.tsx`, `_test.jsx`, `.test.js`, `.test.ts`,
`.test.tsx`, `.test.jsx`

`deno test encourage.test.js`

Or you can pass a specific directory path and Deno will search for test files in
there.

```sh
./tests/
```

You can even check code coverage. By default, when you run deno test \--coverage
a coverage profile will be generated in the /coverage directory in the current
working directory.

```shell
deno test --coverage
```

From there you can run deno coverage to print a coverage report to standard
output

```shell
deno coverage
```

As you can see, Deno's built-in tools are pretty cool. We don't have to spend a
whole day configuring these settings before we can start working on our project.
And we can format, lint, and test code without the need for third-party
dependencies.

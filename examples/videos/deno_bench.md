---
title: "Benchmarking with Deno bench"
description: "Learn how to measure code performance using Deno's built-in benchmarking tool. Discover baseline comparisons, grouped benchmarks, and precise measurement techniques for optimizing your TypeScript and JavaScript code."
url: /examples/deno_bench/
videoUrl: https://www.youtube.com/watch?v=IVde_GTN6TM
layout: video.tsx
---

## Video description

[`deno bench`](/runtime/reference/cli/bench/) is an easy to use benchmarking
tool that ships with the Deno runtime. Here are 3 ways that can level up how you
use deno bench.

## Transcript and code

What's up everyone it's Andy from Deno and today we're going to talk about
`deno bench`. This video is a continuation of our **Deno tool chain** series.

`deno bench` is a benchmarking tool that makes it easy to measure performance,
and if you're coming from Node, `deno bench` saves you time from finding and
integrating a third party benchmarking tool.

### Baseline Summaries

Today we're going to cover some cool use cases with `deno bench`. Most of the
time we'll want to benchmark two or more ways of doing the same thing, here
we're comparing parsing a URL from a string, parsing a URL with a path, and then
also parsing a URL with a path and a URL object:

```typescript title="main_bench.ts"
Deno.bench("url parsing", () => {
  new URL("https://deno.land");
});

Deno.bench("url parsing with path", () => {
  new URL("./welcome.ts", "https://deno.land/");
});

const BASE_URL = new URL("https://deno.land");
Deno.bench("url parsing with a path and a URL object", () => {
  new URL("./welcome.ts", BASE_URL);
});
```

Then run:

```sh
deno bench main_bench.ts
```

The output results show how long it takes each benchmark in nano seconds, as
well as how many iterations per second. Not only that but also includes the CPU
chip and the runtime.

The results indicate that the first approach is the fastest. But what if you
want a more clear way to show exactly how much faster it is? We can pass the
`baseline:true` option into the Benchmark:

```typescript title="main_bench.ts"
Deno.bench("url parsing", { baseline: true }, () => {
  new URL("https://deno.land");
});

...etc
```

When we run it there is now a summary section at the bottom of the output that
shows you exactly how much faster the benchmarks are compared to the baseline.

If you want multiple benchmarks but in the same file you can organize the output
using the `group` option. If we add a fourth Benchmark for splitting text and
run the file we'll see all of the results grouped together, which isn't very
helpful. Instead we can add a group of `url` to the URL benchmarks and a group
of `text` to the text benchmarks:

```typescript title="main_bench.ts"
Deno.bench("url parsing", { baseline: true, group: "url" }, () => {
  new URL("https://deno.land");
});

...etc

const TEXT = "Lorem ipsum dolor sit amet";
Deno.bench("split on whitespace", { group: "text" }, () => {
  TEXT.split(" ");
});
```

Now you will see our results are organized by group.

### More specific benchmarking with `b.start()` and `b.end()`

Did you know that you can be specific about when to start and stop measuring
your benchmarks? Here's a new Benchmark file where we plan to benchmark parsing
the first word of the releases markdown file, which is all the release notes
from the Deno runtime project over the past 5 years. It's over 6,000 lines long!

```typescript title="file_bench.ts"
const FILENAME = "./Releases.md";

Deno.bench("get first word", () => {
  const file = Deno.readTextFileSync(FILENAME);
  const firstWord = file.split(" ")[0];
});
```

Running `deno bench` shows that this operation takes a long time, but it's
mostly because the benchmark requires reading the file in memory. So how do we
benchmark reading just the first word? If we use the `bench`
`context parameter`, we have access to the `start()` and `end()` functions.

```typescript title="file_bench.ts"
const FILENAME = "./Releases.md";

Deno.bench("get first word", (b) => {
  b.start();
  const file = Deno.readTextFileSync(FILENAME);
  const firstWord = file.split(" ")[0];
  b.end();
});
```

Now when we run `deno bench`, you'll notice that this benchmark only measures
the reading of the first word.

This was just a glimpse into `deno bench`, if you want to check out the other
options on Deno Bench check out the other options available to you, you can use
your editor to `ctrl+click` through to the bench definitions, or look at the
[`deno bench` documentation](/runtime/reference/cli/bench/). There are some
other options that you can pass such as
[`only`](/runtime/reference/cli/bench/#bench-definition-filtering) and
[`ignore`](/runtime/reference/cli/bench/#options-ignore).

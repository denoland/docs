---
title: "Deno coverage"
url: /examples/deno_coverage/
videoUrl: https://www.youtube.com/watch?v=P2BBYNPpgW8
layout: video.tsx
---

## Description of video

We updated `deno coverage` in 1.39 with a better output and HTML generation.

## Transcript and code

If you're using `deno test`, have you checked out `deno coverage`?

Dino coverage is a great way to see how much test coverage you have, just add
the coverage flag to Deno test:

```sh
deno test --coverage
```

This will save coverage data to `/coverage`. Then run the coverage command:

```sh
deno coverage ./coverage
```

to see a coverage report.

In Deno 1.39, `deno coverage` was updated in two ways; first it now outputs a
concise summary table and second, if you add the `--html` flag:

```sh
deno coverage ./coverage --html
```

the coverage tool generates static HTML so that you can explore your coverage in
a browser.

We got more plans for Deno coverage, like simplifying the steps into a single
command and more thanks for watching!

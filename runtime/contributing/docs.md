---
title: "Documentation guidelines"
description: "Guide for contributing to Deno's documentation. Learn our documentation standards, writing style, and how to submit documentation changes."
---

We welcome and appreciate contributions to the Deno documentation. If you find
an issue, or want to add to the docs, each page has an "Edit this page" button
at the bottom of the page. Clicking this button will take you to the source file
for that page in the [Deno docs repository](https://github.com/denoland/docs/).
You can then make your changes and submit a pull request.

Some pages in the Deno documentation are generated from source files in the Deno
repository. These pages are not directly editable:

- The [API reference](/api/deno/) pages are generated from type definitions in
  the Deno repository.
- The [CLI reference](/runtime/reference/cli/) pages for each individual command
  are generated from source files in the Deno repository.

If you find an issue with one of these pages, you can either submit a pull
request to the Deno repository. Or raise an issue in the
[Deno docs repository](https://github.com/denoland/docs/issues) and we'll get it
fixed.

## Running the docs locally

You can fork and clone the entire
[Deno docs repository](https://github.com/denoland/docs) to your local machine
and run the docs locally. This is useful if you want to see how your changes
will look before submitting a pull request.

1. Fork the [Deno docs repository](https://github.com/denoland/docs).
2. Clone your fork to your local machine with `git clone`.
3. Change directory into the `docs` directory you just cloned.
4. Run the docs repo locally with `deno task serve`.
5. Open your browser and navigate to `http://localhost:3000`.
6. Optionally, generate the API documentation with `deno task reference`.

To see a more detailed description of available tasks, check out the
[Deno docs README](https://github.com/denoland/docs?tab=readme-ov-file#deno-docs)

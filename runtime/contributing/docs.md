---
title: "Deno documentation"
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
  are generated from source files in the Deno repository. Check
  [_commands_reference.json](https://github.com/denoland/docs/blob/main/runtime/reference/cli/_commands_reference.json).
- Pages for individual [Lint rules](/lint/) reside in the
  [Deno docs repository](https://github.com/denoland/docs/) but direct edit
  links are broken [at the moment](https://github.com/denoland/docs/issues/1511). In the
  meantime, check thed [main/lint/rules](https://github.com/denoland/docs/tree/main/lint/rules)
  directory.

If you find an issue with one of these pages, you can either submit a pull
request to the Deno repository, or raise an issue in the
[Deno docs repository](https://github.com/denoland/docs/issues) and we'll get it
fixed.

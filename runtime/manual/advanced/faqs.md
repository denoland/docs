---
title: "Frequently Asked Questions"
oldUrl: 
- /runtime/manual/node/faqs
---

## Getting type errors like cannot find `document` or `HTMLElement`

The library you are using has dependencies on the DOM. This is common for
packages that are designed to run in a browser as well as server-side. By
default, Deno only includes the libraries that are directly supported. Assuming
the package properly identifies what environment it is running in at runtime it
is "safe" to use the DOM libraries to type check the code. For more information
on this, check out the
[Targeting Deno and the Browser](../advanced/typescript/configuration.md#targeting-deno-and-the-browser)
section of the manual.

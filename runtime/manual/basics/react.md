---
title: "Using React with Deno"
---

To use React with Deno, we recommend using one of the third-party frameworks
below.

If you want to better understand how JSX and Deno interface under the hood, read
on [here](../advanced/jsx).

Note: Fresh and Aleph.js provide a framework for developing React-like websites.
However, Fresh uses an alternative foundational technology, Preact to provide a
better, more performant experience.

## Fresh

[Fresh](https://fresh.deno.dev/) is the most popular React framework for Deno.
It uses a model where you send no JavaScript to clients by default. The majority
of rendering is done on a server, and the client is only responsible for
re-rendering small
[islands of interactivity](https://jasonformat.com/islands-architecture/). This
means the developer explicitly opts in to client side rendering for specific
components.

## Aleph

[Aleph.js](https://alephjs.org/docs/get-started) is the second most popular
React framework for Deno. It gives you the same sort of quick-start with React
as Create-React-App. Like Next.js, Aleph provides SSR and SSG out of the box in
order to allow developers to create SEO-friendly apps. In addition, Aleph
provides some other built-in features that don't come out of the box in Next.js,
such as:

- Hot Reloading (Using React Fast Refresh)
- ESM Import Syntax (No need for webpack)
- TypeScript-Ready

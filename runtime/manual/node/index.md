---
title: "Node and npm modules"
oldUrl: /runtime/manual/npm_nodejs/std_node/
---

Many people will want to leverage code and libraries that are built for
[Node](https://nodejs.org/), in particular the large set of packages available
on the [npm](https://npmjs.com/) registry.

There are currently several ways to do this - check out the links below to learn
more about these methods.

- Using [`npm:` specifiers](./npm_specifiers.md) and
  [`node:` specifiers](./node_specifiers.md)
- [package.json compatibility](./package_json.md)
- Using [CDNs](./cdns.md)

## Unstable compatibility features

Node and npm compatibility is an ongoing project for the Deno team. As such,
there are a number of unstable features aimed at improving compatibility that
you may want to reference. Please check out the
[unstable feature flags](/runtime/manual/tools/unstable_flags) documentation for
options that may improve your project's compatibility with code written for
Node.js.

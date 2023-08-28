# dnt - Publishing Deno modules for Node.js

Library authors may want to make their Deno modules available to Node.js users.
This is possible by using the [dnt](https://github.com/denoland/dnt) build tool.

dnt allows you to develop your Deno module mostly as-is and use a single Deno
script to build, type check, and test an npm package in an output directory.
Once built, you only need to `npm publish` the output directory to distribute it
to Node.js users.

For more details, see https://github.com/denoland/dnt

# Deno Docs

This repository contains the website running
[docs.deno.com](https://docs.deno.com). The intent of this project is to
eventually centralize all official Deno documentation content in a single
website. The Deno Docs site is built using
[Docusaurus 2](https://docusaurus.io/), a static site generator optimized for
documentation websites.

The `docs.deno.com` website is hosted on [Deno Deploy](https://deno.com/deploy),
where it is fronted by a [Hono](https://hono.dev/) web server that handles
redirects and other dynamic content requests.

## Local development

Since Docusaurus is built and maintained using Node.js, it is recommended to
have [Node.js and npm](https://nodejs.org/en/download) installed for local
development. Once Node and npm are installed, install Docusaurus' dependencies
with:

```
npm install
```

You can then start the local development server with:

```
npm start
```

This will launch a browser window open to
[localhost:3000](http://localhost:3000), where you will see any doc content
changes you make update live.

To test the generated static site in a production configuration, run:

```
npm run build
```

This will generate a static site to the `build` folder locally. Change into this
directory, and run the Deno server bundled there with:

```
deno run --allow-net --allow-read server.ts
```

This will start a Deno server on [localhost:8000](http://localhost:8000), where
you can preview the site as it will run on Deno Deploy.

Sometimes, after making a Docusaurus config change, you will run into an error
and need to clean Docusaurus' generated assets. You can do this by running:

```
npm run clear
```

This will solve most errors you encounter while refactoring the site.

## Editing content

The actual content of the docs site is found mostly in these three folders:

- `runtime` - docs for the Deno CLI / runtime
- `deploy` - docs for the Deno Deploy cloud service
- `kv` - docs for Deno KV, Deno's integrated database

Most files are [markdown](https://docusaurus.io/docs/markdown-features), but
even markdown files are processed with [MDX](https://mdxjs.com/), which enables
you to use JSX syntax within your markdown files.

Left navigation for the different doc sections are configured in one of these
files:

- `sidebars/runtime.js` - sidebar config for the Runtime section
- `sidebars/deploy.js` - sidebar config for the Deno Deploy section
- `sidebars/kv.js` - sidebar config for the KV section

Static files (like screenshots) can be included directly in the `runtime`,
`deploy`, or `kv` folders, and referenced by relative URLs in your markdown.

Docusaurus provides a number of nice extensions to markdown you might want to
use, like tabs, admonitions, and code blocks.
[Refer to the Docusaurus docs](https://docusaurus.io/docs/markdown-features) for
more details.

## Versioning docs content

Philosophically, we want to maintain as few discrete versions of the
documentation as possible. This will reduce confusion for users (reduce the
number of versions they need to think about) and help us maintain the docs by
keeping our build times faster.

In general, we should only version the documentation **when we want to
concurrently maintain several versions of the docs**, like for major/LTS
versions. For example - the [Node.js docs](https://nodejs.org/en/docs) are only
versioned for major releases, like `20.x` and `19.x`. We will adopt this pattern
as well, and won't have versioned docs for patch or feature releases.

For additive changes, it should usually be sufficient to indicate which version
a feature or API was released in. For example - in the Node 20 docs, the
[register function](https://nodejs.org/dist/latest-v20.x/docs/api/module.html#moduleregister)
is marked as being added in version `20.6.0`.

When we do want to maintain versioned docs for major releases, we currently plan
to use [Docusaurus versions](https://docusaurus.io/docs/versioning).

## Including version numbers in code and content

It may occasionally be desirable to dynamically include the current Deno CLI or
standard library version in content or code samples. We can accomplish this
using the `replacements.json` file at the root of this repository.

In code samples (fenced with backticks), you can include a `$` character,
followed by the replacement variable name, directly within the code sample. When
the markdown is transformed, the current version number will be replaced within
it.

```ts
import { copy } from "https://deno.land/std@$STD_VERSION/fs/copy.ts";
```

To include version number in markdown / MDX content, we recommend using the
`<Replacement />` component:

```mdx
import Replacement from "@site/src/components/Replacement";

The current CLI version is **<Replacement for="CLI_VERSION"/>**.
```

## Deployment

The `docs.deno.com` site is updated with every push to the `main` branch, which
should be done via pull request to this repository.

## License

MIT

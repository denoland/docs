# Deno Docs

This repository contains the website running
[docs.deno.com](https://docs.deno.com). The intent of this project is to
eventually centralize all official Deno documentation content in a single
website. The Deno Docs site is built using
[Docusaurus 2](https://docusaurus.io/), a static site generator optimized for
documentation websites.

The `docs.deno.com` website is hosted on [Deno Deploy](https://deno.com/deploy),
where it is fronted by a [Hono](https://hono.dev/) web server that handles
redirects and other dynamic content requests as they become necessary.

## Local development

Since Docusaurus is built and maintained using Node.js, it is recommended to
have [Node.js and npm](https://nodejs.org/en/download) installed for local
development. Once Node and npm are installed, install Docusaurus' dependencies
with:

```console
npm install
```

You can then start the local development server with:

```console
npm start
```

This will launch a browser window open to
[localhost:3000](http://localhost:3000), where you will see any doc content
changes you make update live.

To test the generated static site in a production configuration, run:

```console
npm run build
```

This will generate a static site to the `build` folder locally. To test the
production server (through the actual Deno / Hono server), run this command:

```console
npm run serve
```

This will start a Deno server on [localhost:8000](http://localhost:8000), where
you can preview the site as it will run on Deno Deploy.

Sometimes, after making a Docusaurus config change, you will run into an error
and need to clean Docusaurus' generated assets. You can do this by running:

```console
npm run clear
```

This will solve most errors you encounter while refactoring the site. Static
assets will be rebuilt from scratch the next time you run `npm run build` or
`npm start`.

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
number of versions they need to think about), improve search indexing, and help
us maintain the docs by keeping our build times faster.

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

Any values you would like to change once, and then have appear dynamically in a
number of generated files, should be included in `replacements.json`.

In code samples (fenced with backticks), you can include a `$` character,
followed by the replacement variable name, directly within the code sample. When
the markdown is transformed, the current version number will be replaced within
it.

```ts
import { copy } from "jsr:@std/fs@^0/copy";
```

To include version number in markdown / MDX content, we recommend using the
`<Replacement />` component:

```mdx
import Replacement from "@site/src/components/Replacement";

The current CLI version is **<Replacement for="CLI_VERSION"/>**.
```

If you are writing inline JSX, you can also use the replacements object directly
like so:

```mdx
import { replacements } from "@site/src/components/Replacement";

<p>
  The current CLI version is <code>{ replacements.CLI_VERSION }</code>.
</p>
```

## Server-side code and redirects

The Deno code that serves the site in production is in the `src-deno` folder.
When the `npm run build` command is executed for a production Docusaurus build,
it also copies the contents of the `src-deno` folder (unchanged) into the
resulting `build` folder, which will be our project root for Deno Deploy.

Right now, there is just a very thin [Hono](https://hono.dev/) server sitting on
top of the static assets generated by Docusaurus. The only interesting job the
Hono app has right now is handling redirects, of which there are several from
the previous Deno doc sites.

To add a redirect, open `src-deno/redirects.ts` and configure a new route in the
default exported function. The default status code of `301` should be sufficient
for most cases.

## New release process for Deno runtime

Let's say that a new minor release is ready for Deno, with CLI version `1.99`
and standard library version `0.999.0`. Here's how I would recommend approaching
the docs for this release right now.

- Create a feature branch for the release, like `release_1_99` or similar
- Update `replacements.json` with the upcoming CLI and standard lib versions
- As the release is developed, add docs changes to this branch
- When the release is ready, submit a PR to the `main` branch from this feature
  branch
- When the branch is merged, create a `v1.99` tag from the new `main` branch

For patch releases, I would recommend simply submitting pull requests to the
`main` branch with relevant updates to `replacements.json` as required.

If we decide we'd like to have "canary" docs for upcoming versions, we can
discuss how to make that possible with
[Docusaurus versions](https://docusaurus.io/docs/versioning).

## Contribution

We are very grateful for any help you can offer to improve Deno's documentation!
For any small copy changes or fixes, please feel free to
[submit a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
directly to the `main` branch of this repository.

For larger changes, please
[create a GitHub issue first](https://github.com/denoland/deno-docs/issues) to
describe your proposed updates. It will be better to get feedback on your
concept first before going to the trouble of writing a large number of docs!

Over time, we will add more in the way of linting and formatting to the pull
request process. But for now, you should merely ensure that `npm run build`
succeeds without error before submitting a pull request. This will ensure that
there are no broken links or invalid MDX syntax in the content you have
authored.

## Special thanks for historical contributions

This repository was created using content from the
[Deno Manual](https://github.com/denoland/manual), a project contributed to by
hundreds of developers since 2018. You can view a list of historical
contributors to the Deno documentation in this repository and the manual with
this command:

```
git shortlog -s -n
```

## Deployment

The `docs.deno.com` site is updated with every push to the `main` branch, which
should be done via pull request to this repository.

## License

MIT

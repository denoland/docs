# Deno Docs

This repository contains the website running
[docs.deno.com](https://docs.deno.com). The intent of this project is to
centralize all official Deno documentation content in a single website. The Deno
Docs site is built using [Lume](https://lume.land/), an extremely fast static
site generator.

The `docs.deno.com` website is hosted on [Deno Deploy](https://deno.com/deploy).

## Local development

Install [Deno](https://deno.com).

You can then start the local development server with:

```console
deno task serve
```

This will launch a browser window open to
[localhost:3000](http://localhost:3000), where you will see any doc content
changes you make update live. Here redirects will not work. If you want
redirects to work, you need to run:

```console
deno task build
deno task prod
```

Which will start a Deno server on [localhost:8000](http://localhost:8000) used
in production, which handles redirects.

## Editing content

The actual content of the docs site is found mostly in these folders:

- `runtime` - docs for the Deno CLI / runtime
- `deploy` - docs for the Deno Deploy cloud service
- `subhosting` - docs for Deno Subhosting
- `examples` - docs for the [Examples](#Examples) section

Most files are [markdown](https://lume.land/plugins/markdown/), but even
markdown files are processed with [MDX](https://mdxjs.com/), which enables you
to use JSX syntax within your markdown files.

Left navigation for the different doc sections are configured in the `_data.ts`
files in their respective content directories.

- `runtime/_data.ts` - sidebar config for the Runtime section
- `deploy/_data.ts` - sidebar config for the Deno Deploy section

Static files (like screenshots) can be included directly in the `runtime`,
`deploy`, or `kv` folders, and referenced by relative URLs in your markdown.

## Reference docs

The reference docs served at `/api` are generated via the `deno doc` subcommand.
To generate the reference docs locally, run:

```console
deno task reference
```

This will generate the reference docs, and you can use the `serve` or `build`
tasks.

Content is generated automatically from the Deno source code to populate the API
references. This content can be edited by modifying the corresponding JSDoc
comments in the source code which is then ingested into the docs site during a
build once those changes are published in the latest binary of the Deno CLI.

### Previewing API reference changes

In order to preview changes to the API reference, we need to take the following
steps:

1. Make changes to the JSDoc comments in the Deno source code
1. [Build the Deno CLI locally](https://docs.deno.com/runtime/contributing/building_from_source/),
   including your JSDoc changes
1. For convenience, create an alias of `d_deno` to point to your local build of
   the Deno CLI (typically in the `target/debug/deno` directory of your CLI
   repo)
1. Generate the reference docs from your local build of the Deno CLI by running
   in the root directory `d_deno task reference`
1. Run the `deno task serve` command in the root directory to see the changes

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

## Examples

[Deno by Example](https://docs.deno.com/examples) is a collection of small
snippets of code, tutorials and videos showcasing various functions of the APIs
implemented in Deno.

### Adding an example script

- Examples are written in TypeScript
- Each example should be a single file, no more than 50 lines
- Each example should be a self-contained unit, and should depend on no
  dependencies other than Deno builtins and the standard library, unless a
  third-party library is strictly required.
- Each example should be runnable without additional dependencies on all systems
  (exceptions can be made for platform specific functionality)
- Examples should be introduce at most one (or in exceptional cases two or
  three) concepts in Deno / Web APIs. Existing concepts should be linked to.
- Code should be kept _really simple_, and should be easy to read and understand
  by anyone. Do not use complicated code constructs, or hard to follow builtins
  like `Array.reduce`
- Concepts introduced in an example should be explained

### Adding an example

To add an example, create a file in the `examples/scripts` directory. The file
name should be a short description of the example (in kebab case) and the
contents should be the code for the example. The file should be in the `.ts`
format. The file should start with a JSDoc style multi line comment that
describes the example:

```ts
/**
 * @title HTTP server: Hello World
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net <url>
 * @group Basics
 *
 * An example of a HTTP server that serves a "Hello World" message.
 */
```

You should add a title, a difficulty level (`beginner` or `intermediate`), and a
list of tags (`cli`, `deploy`, `web` depending on where an example is runnable).
The `@run` tag should be included if the example can be run locally by just
doing `deno run <url>`. If running requires permissions, add these:

```ts
/**
 * ...
 * @run --allow-net --allow-read <url>
 */
```

After the pragmas, you can add a description of the example. This is optional,
but recommended for most examples. It should not be longer than one or two
lines. The description shows up at the top of the example in the example page,
and in search results.

After the JS Doc comment, you can write the code. Code can be prefixed with a
comment that describes the code. The comment will be rendered next to the code
in the example page.

## Special thanks for historical contributions

This repository was created using content from the
[Deno Manual](https://github.com/denoland/manual), a project contributed to by
hundreds of developers since 2018. You can view a list of historical
contributors to the Deno documentation in this repository and the manual with
this command:

```bash
git shortlog -s -n
```

## Deployment

The `docs.deno.com` site is updated with every push to the `main` branch, which
should be done via pull request to this repository.

## License

MIT

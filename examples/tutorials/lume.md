---
title: "Build a static site with Lume"
description: "Step-by-step tutorial on building a static site with Lume and Deno. Learn how to scaffold a project, add content pages, use layouts, run the dev server, and build for production."
url: /examples/lume_tutorial/
---

[Lume](https://lume.land/) is a static site generator for Deno, inspired by
Jekyll and Eleventy. It is small, fast, and unopinionated: you bring Markdown,
JSX, Nunjucks, or any of a dozen supported formats, and Lume turns them into a
static site. These very docs are built with Lume.

## Scaffold a Lume project

Lume has an interactive initializer. In an empty directory, run:

```sh
deno run -A https://lume.land/init.ts
```

It asks a few questions (which plugins to enable, whether to set up a CMS); the
defaults are a fine starting point. When it finishes you have a `_config.ts`
file, a `deno.json` with tasks, and an import for Lume itself.

The `_config.ts` file is where you configure and extend the site. The starter
version just creates a site and exports it:

```ts title="_config.ts"
import lume from "lume/mod.ts";

const site = lume();

export default site;
```

## Add a layout and a page

Lume treats files in the project root as content. Markdown files become pages,
and a page's front matter sets its variables. Create a layout in
`_includes/layout.vto`, using Lume's default Vento template engine:

```html title="_includes/layout.vto"
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

Then create `index.md`. The `layout` key points at the template, and the body is
rendered into the template's `content` variable:

```md title="index.md"
---
title: My Lume site
layout: layout.vto
---

# Welcome

This page is written in Markdown and wrapped in a layout.
```

## Run the dev server

Lume's tasks are set up in `deno.json`. Start the development server, which
watches for changes and live-reloads the browser:

```sh
deno task serve
```

```sh
Server started at:
http://localhost:3000/ (local)
```

Open the URL and you will see your page, with the Markdown rendered inside the
layout.

## Build for production

When you are ready to publish, build the site to static files:

```sh
deno task build
```

```sh
🔥 / <- /index.md
🍾 Site built into ./_site
```

The `_site` directory now holds plain HTML, CSS, and assets that you can deploy
to [Deno Deploy](https://docs.deno.com/deploy/) or any static host. To add more
to the site, explore Lume's [plugins](https://lume.land/plugins/) for things
like SCSS, esbuild, and image processing, all configured in `_config.ts`.

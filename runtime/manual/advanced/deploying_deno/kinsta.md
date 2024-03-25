# How to Deploy Deno on Kinsta

[Kinsta Application Hosting](https://kinsta.com/application-hosting) is a
service that lets you build and deploy your web apps directly from your Git
repository.

## Preparing your application

At **Kinsta**, we recommend using the
[`deno-bin`](https://www.npmjs.com/package/deno-bin) package to run Deno
applications.

To do so, your `package.json` should look like this:

```json
{
  "name": "deno app",
  "scripts": {
    "start": "deno run --allow-net index.js --port=${PORT}"
  },
  "devDependencies": {
    "deno-bin": "^1.28.2"
  }
}
```

## Example application

```js
import { parseArgs } from "jsr:std/cli@^0/parse_args";

const { args } = Deno;
const port = parseArgs(args).port ? Number(parseArgs(args).port) : 8000;

Deno.serve({ port }, (_req) => new Response("Hello, world"));
```

The application itself is self-explanatory. It's crucial not to hardcode the
`PORT` but use the environmental variable **Kinsta** provides.

There is also a [repository](https://github.com/kinsta/hello-world-deno) that
should help you to get started.

## Deployment

1. Register on
   [Kinsta Application Hosting](https://kinsta.com/signup/?product_type=app-db)
   or login directly to [My Kinsta](https://my.kinsta.com/) admin panel.
2. Go to the Applications tab.
3. Connect your GitHub repository.
4. Press the **Add service > Application button**.
5. Follow the wizard steps.

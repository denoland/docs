---
title: "Private NPM Registries"
---

Deno supports private registries, which allow you to host and share your own
modules. This is useful for organizations that want to keep their code private
or for individuals who want to share their code with a select group of people.

## What are private registries?

Large organizations often host their own private npm registries to manage
internal packages securely. These private registries serve as repositories where
organizations can publish and store their proprietary or custom packages. Unlike
public npm registries, private registries are accessible only to authorized
users within the organization.

## How to use private registries with Deno

First, configure your `.npmrc` file to point to your private registry. Your
`.npmrc` file must be in the project root or `$HOME` directory. You can do this
by adding the following line to your `.npmrc` file:

```sh
@mycompany:registry=http://mycompany.com:8111/
//mycompany.com:8111/:_auth=secretToken
```

Replace `http://mycompany.com:8111/` with the actual URL of your private
registry and `secretToken` with your authentication token.

Then update Your `deno.json` or `package.json` to specify the import path for
your private package. For example:

```json title="deno.json"
{
  "imports": {
    "@mycompany/package": "npm:@mycompany/package@1.0.0"
  }
}
```

or if you're using a `package.json`:

```json title="package.json"
{
  "dependencies": {
    "@mycompany/package": "1.0.0"
  }
}
```

Now you can import your private package in your Deno code:

```typescript title="main.ts"
import { hello } from "@mycompany/package";

console.log(hello());
```

and run it using the `deno run` command:

```sh
deno run main.ts
```

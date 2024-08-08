---
title: "Private NPM Registries"
---

:::note

Not to be confused with
[private repositories and modules](/runtime/manual/advanced/private_repositories/).

:::

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

First, configure your
[`.npmrc`](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc) file to point
to your private registry. The `.npmrc` file must be in the project root or
`$HOME` directory. Add the following to your `.npmrc` file:

```sh
@mycompany:registry=http://mycompany.com:8111/
//mycompany.com:8111/:_auth=secretToken
```

Replace `http://mycompany.com:8111/` with the actual URL of your private
registry and `secretToken` with your authentication token. This will pull all
`npm:@mycompany/*` packages from your private registry instead of the official
public one.

When you run `deno install`, `deno install npm:@mycompany/package` or refer to
any npm packages on your company scope (`npm:@mycompany/package`), Deno will
download them from the private registry.

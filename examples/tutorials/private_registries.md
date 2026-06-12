---
title: "Use private npm registries"
description: "Configure Deno to install npm packages from private registries: .npmrc scoped registries and auth tokens, the NPM_CONFIG_REGISTRY override, DENO_AUTH_TOKENS, and worked setups for Azure Artifacts and JFrog Artifactory."
url: /examples/private_registries_tutorial/
---

Deno reads the same `.npmrc` file that npm uses, so packages hosted on a private
npm registry install with `deno install` and `deno add` just like public ones.
This tutorial sets up a scoped registry with an auth token, then covers
registry-wide overrides and two common hosted registries.

## Point a scope at your registry

Create an `.npmrc` file that maps your organization's scope to the registry URL,
and attaches an auth token to that host:

```ini title=".npmrc"
@mycompany:registry=https://registry.mycompany.com/
//registry.mycompany.com/:_auth=secretToken
```

Deno looks for `.npmrc` in the project root first, then in your `$HOME`
directory. With this in place, depend on the package as usual:

```json title="deno.json"
{
  "imports": {
    "@mycompany/package": "npm:@mycompany/package@1.0.0"
  }
}
```

Every `npm:@mycompany/...` specifier now resolves through your registry;
everything else still comes from the default npm registry.

## Override the registry for all packages

To send _all_ npm requests to one registry, set the `NPM_CONFIG_REGISTRY`
environment variable:

```sh
NPM_CONFIG_REGISTRY=https://registry.mycompany.com/ deno install
```

It overrides the registry configured in `.npmrc`, matching npm's own precedence,
which makes it a good fit for CI where you want to redirect installs without
editing the checked-in `.npmrc`.

## Authenticate private HTTPS and JSR imports

`.npmrc` only covers `npm:` packages. For modules imported from private HTTPS
hosts (for example a private GitHub repository), use the `DENO_AUTH_TOKENS`
environment variable. Each entry is either a bearer token (`{token}@{hostname}`)
or basic auth (`{username}:{password}@{hostname}`), with multiple entries
separated by semicolons:

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@deno.land;username:password@example.com:8080
```

Deno sends the matching `Authorization` header when fetching modules from those
hosts.

## GitHub Packages

The GitHub npm registry authenticates with a personal access token (or
`GITHUB_TOKEN` in Actions) using the `_authToken` field:

```ini title=".npmrc"
@mycompany:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=ghp_yourTokenHere
```

Deno sends it as a bearer token, the same as npm does.

## Verdaccio

For a self-hosted [Verdaccio](https://verdaccio.org/) instance the setup is
identical: point the scope (or `NPM_CONFIG_REGISTRY` for everything) at your
instance and supply its token:

```ini title=".npmrc"
@mycompany:registry=https://verdaccio.mycompany.com/
//verdaccio.mycompany.com/:_authToken=secretToken
```

## Azure Artifacts

Azure Artifacts feeds use this registry URL shape (a typical Azure feed URL;
substitute your organization and feed names):

```ini title=".npmrc"
@mycompany:registry=https://pkgs.dev.azure.com/{org}/_packaging/{feed}/npm/registry/
//pkgs.dev.azure.com/{org}/_packaging/{feed}/npm/registry/:_auth=base64EncodedToken
```

## JFrog Artifactory

Artifactory npm repositories follow this URL convention:

```ini title=".npmrc"
@mycompany:registry=https://{host}/artifactory/api/npm/{repo}/
//{host}/artifactory/api/npm/{repo}/:_auth=secretToken
```

:::caution

Treat `.npmrc` files containing tokens as secrets. Prefer injecting the token
via your CI provider's secret store rather than committing it.

:::

## Mutual TLS

If the registry requires client certificates (mTLS), point Deno at PEM files
with the `certfile` and `keyfile` fields (Deno 2.8+):

```ini title=".npmrc"
//registry.mycompany.com/:certfile=/etc/deno/client.crt
//registry.mycompany.com/:keyfile=/etc/deno/client.key
```

Deno also reads the `email` field for legacy registries that require it, and
`min-release-age` as a supply-chain guard; see
[the `.npmrc` configuration reference](/runtime/fundamentals/node/#private-registries)
for all supported fields.

# Import Completions and Intelligent Registries

The language server, supports completions for URLs.

## Local import completions

When attempting to import a relative module specifier (one that starts with `./`
or `../`), import completions are provided for directories and files that Deno
thinks it can run (ending with the extensions `.ts`, `.js`, `.tsx`, `.jsx`, or
`.mjs`).

## Workspace import completions

When attempting to import a remote URL that isn't configured as a registry (see
below), the extension will provide remote modules that are already part of the
workspace.

## Module registry completions

Module registries that support it can be configured for auto completion. This
provides a handy way to explore a module registry from the "comfort" of your
IDE.

### Auto-discovery

The Deno language server, by default, will attempt to determine if a server
supports completion suggestions. If the host/origin has not been explicitly
configured, it will check the server, and if it supports completion suggestions
you will be prompted to choose to enable it or not.

You should only enable this for registries you trust, as the remote server could
provide suggestions for modules which are an attempt to get you to run
un-trusted code.

### Configuration

Settings for configuring registries for auto completions:

- `deno.suggest.imports.autoDiscover` - If enabled, when the language server
  discovers a new origin that isn't explicitly configured, it will check to see
  if that origin supports import completions and prompt you to enable it or not.
  This is `true` by default.
- `deno.suggest.imports.hosts` - These are the _origins_ that are configured to
  provide import completions. The target host needs to support Deno import
  completions (detailed below). The value is an object where the key is the host
  and the value is if it is enabled or not. For example:

  ```json
  {
    "deno.suggest.imports.hosts": {
      "https://deno.land": true
    }
  }
  ```

### How does it work?

On startup of the extension and language server, Deno will attempt to fetch
`/.well-known/deno-import-intellisense.json` from any of the hosts that are
configured and enabled. This file provides the data necessary to form auto
completion of module specifiers in a highly configurable way (meaning you aren't
tied into any particular module registry in order to get a rich editor
experience).

As you build or edit your module specifier, Deno will go and fetch additional
parts of the URL from the host based on what is configured in the JSON
configuration file.

When you complete the module specifier, if it isn't already cached locally for
you, Deno will attempt to fetch the completed specifier from the registry.

### Does it work with all remote modules?

No, as the extension and Deno need to understand how to _find_ modules. The
configuration file provides a highly flexible way to allow people to describe
how to build up a URL, including supporting things like semantic versioning if
the module registry supports it.

## Registry support for import completions

In order to support having a registry be discoverable by the Deno language
server, the registry needs to provide a few things:

- A schema definition file. This file needs to be located at
  `/.well-known/deno-import-intellisense.json`. This file provides the
  configuration needed to allow the Deno language server _query_ the registry
  and construct import specifiers.
- A series of API endpoints that provide the values to be provided to the user
  to complete an import specifier.

### Configuration schema

The JSON response to the schema definition needs to be an object with two
required properties:

- `"version"` - a number, which must be equal to `1` or `2`.
- `"registries"` - an array of registry objects which define how the module
  specifiers are constructed for this registry.

[There is a JSON Schema document which defines this
schema available as part of the CLI's source code.](https://deno.land/x/deno/cli/schemas/registry-completions.v2.json)

While the v2 supports more features than v1 did, they were introduced in a
non-breaking way, and the language server automatically handles v1 or v2
versions, irrespective of what version is supplied in the `"version"` key, so
technically a registry could profess itself to be v1 but use all the v2
features. This is not recommended though, because while there is no specific
branches in code to support the v2 features currently, that doesn't mean there
will not be in the future in order to support a _v3_ or whatever.

### Registries

In the configuration schema, the `"registries"` property is an array of
registries, which are objects which contain two required properties:

- `"schema"` - a string, which is an Express-like path matching expression,
  which defines how URLs are built on the registry. The syntax is directly based
  on [path-to-regexp](https://github.com/pillarjs/path-to-regexp). For example,
  if the following was the specifier for a URL on the registry:

  ```
  https://example.com/a_package@v1.0.0/mod.ts
  ```

  The schema value might be something like this:

  ```json
  {
    "version": 1,
    "registries": [
      {
        "schema": "/:package([a-z0-9_]*)@:version?/:path*"
      }
    ]
  }
  ```

- `"variables"` - for the keys defined in the schema, a corresponding variable
  needs to be defined, which informs the language server where to fetch
  completions for that part of the module specifier. In the example above, we
  had 3 variables of `package`, `version` and `path`, so we would expect a
  variable definition for each.

### Variables

In the configuration schema, the `"variables"` property is an array of variable
definitions, which are objects with two required properties:

- `"key"` - a string which matches the variable key name specifier in the
  `"schema"` property.
- `"documentation"` - An optional URL where the language server can fetch the
  documentation for an individual variable entry. Variables can be substituted
  in to build the final URL. Variables with a single brace format like
  `${variable}` will be added as matched out of the string, and those with
  double format like `${{variable}}` will be percent-encoded as a URI component
  part.
- `"url"` - A URL where the language server can fetch the completions for the
  variable. Variables can be substituted in to build the URL. Variables with a
  single brace format like `${variable}` will be added as matched out of the
  string, and those with double format like `${{variable}}` will be
  percent-encoded as a URI component part. If the variable the value of the
  `"key"` is included, then the language server will support incremental
  requests for partial modules, allowing the server to provide completions as a
  user types part of the variable value. If the URL is not fully qualified, the
  URL of the schema file will be used as a base. In our example above, we had
  three variables and so our variable definition might look like:

  ```json
  {
    "version": 1,
    "registries": [
      {
        "schema": "/:package([a-z0-9_]*)@:version?/:path*",
        "variables": [
          {
            "key": "package",
            "documentation": "https://api.example.com/docs/packages/${package}",
            "url": "https://api.example.com/packages/${package}"
          },
          {
            "key": "version",
            "url": "https://api.example.com/packages/${package}/versions"
          },
          {
            "key": "path",
            "documentation": "https://api.example.com/docs/packages/${package}/${{version}}/paths/${path}",
            "url": "https://api.example.com/packages/${package}/${{version}}/paths/${path}"
          }
        ]
      }
    ]
  }
  ```

#### URL endpoints

The response from each URL endpoint needs to be a JSON document that is an array
of strings or a _completions list_:

```typescript
interface CompletionList {
  /** The list (or partial list) of completion items. */
  items: string[];
  /** If the list is a partial list, and further queries to the endpoint will
   * change the items, set `isIncomplete` to `true`. */
  isIncomplete?: boolean;
  /** If one of the items in the list should be preselected (the default
   * suggestion), then set the value of `preselect` to the value of the item. */
  preselect?: string;
}
```

Extending our example from above the URL `https://api.example.com/packages`
would be expected to return something like:

```json
[
  "a_package",
  "another_package",
  "my_awesome_package"
]
```

Or something like this:

```json
{
  "items": [
    "a_package",
    "another_package",
    "my_awesome_package"
  ],
  "isIncomplete": false,
  "preselect": "a_package"
}
```

And a query to `https://api.example.com/packages/a_package/versions` would
return something like:

```json
[
  "v1.0.0",
  "v1.0.1",
  "v1.1.0",
  "v2.0.0"
]
```

Or:

```json
{
  "items": [
    "v1.0.0",
    "v1.0.1",
    "v1.1.0",
    "v2.0.0"
  ],
  "preselect": "v2.0.0"
}
```

And a query to
`https://api.example.com/packages/a_package/versions/v1.0.0/paths` would return
something like:

```json
[
  "a.ts",
  "b/c.js",
  "d/e.ts"
]
```

Or:

```json
{
  "items": [
    "a.ts",
    "b/c.js",
    "d/e.ts"
  ],
  "isIncomplete": true,
  "preselect": "a.ts"
}
```

#### Multi-part variables and folders

Navigating large file listings can be a challenge for the user. With the
registry V2, the language server has some special handling of returned items to
make it easier to complete a path to file in sub-folders easier.

When an item is returned that ends in `/`, the language server will present it
to the client as a "folder" which will be represented in the client. So a
registry wishing to provide sub-navigation to a folder structure like this:

```
examples/
└─┬─ first.ts
  └─ second.ts
sub-mod/
└─┬─ mod.ts
  └─ tests.ts
mod.ts
```

And had a schema like `/:package([a-z0-9_]*)@:version?/:path*` and an API
endpoint for `path` like
`https://api.example.com/packages/${package}/${{version}}/${path}` would want to
respond to the path of `/packages/pkg/1.0.0/` with:

```json
{
  "items": [
    "examples/",
    "sub-mod/",
    "mod.ts"
  ],
  "isIncomplete": true
}
```

And to a path of `/packages/pkg/1.0.0/examples/` with:

```json
{
  "items": [
    "examples/first.ts",
    "examples/second.ts"
  ],
  "isIncomplete": true
}
```

This would allow the user to select the folder `examples` in the IDE before
getting the listing of what was in the folder, making it easier to navigate the
file structure.

#### Documentation endpoints

Documentation endpoints should return a documentation object with any
documentation related to the requested entity:

```typescript
interface Documentation {
  kind: "markdown" | "plaintext";
  value: string;
}
```

For extending the example from above, a query to
`https://api.example.com/packages/a_package` would return something like:

```json
{
  "kind": "markdown",
  "value": "some _markdown_ `documentation` here..."
}
```

### Schema validation

When the language server is started up (or the configuration for the extension
is changed) the language server will attempt to fetch and validate the schema
configuration for the domain hosts specifier in the configuration.

The validation attempts to make sure that all registries defined are valid, that
the variables contained in those schemas are specified in the variables, and
that there aren't extra variables defined that are not included in the schema.
If the validation fails, the registry won't be enabled and the errors will be
logged to the Deno Language Server output in vscode.

If you are a registry maintainer and need help, advice, or assistance in setting
up your registry for auto-completions, feel free to open up an
[issue](https://github.com/denoland/deno/issues/new?labels=lsp&title=lsp%3A%20registry%20configuration)
and we will try to help.

## Known registries

The following is a list of registries known to support the scheme. All you need
to do is add the domain to `deno.suggest.imports.hosts` and set the value to
`true`:

- `https://deno.land/` - both the 3rd party `/x/` registry and the `/std/`
  library registry are available.
- `https://nest.land/` - a module registry for Deno on the blockweave.
- `https://crux.land/` - a free open-source registry for permanently hosting
  small scripts.

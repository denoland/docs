---
title: "Lint Plugins"
---

:::caution

This is an experimental feature and requires Deno `2.2.0` or newer.

:::

The built-in linter can be extended with plugins to add custom lint rules.

Whilst Deno ships with [many lint rules](/lint/) out of the box, there are cases
where you need a custom rule tailored particularily to your project - whether to
catch a context-specific problem or enforce company-wide conventions.

This is where the lint plugin API comes into play.

The lint plugin API is intentionally modelled after the
[ESLint API](https://eslint.org/docs/latest/extend/custom-rules). While this API
doesn't provide 100% compatibility, the existing knowledge of authoring ESLint
plugins can be mostly reused if you happen to have written custom
[ESLint](https://eslint.org/) rules in the past.

Plugins are loaded via `lint.plugins` setting in `deno.json`.

The value is an array of specifiers to plugins. These can be paths, `npm:` or
`jsr:` specifiers.

```json title="deno.json"
{
  "lint": {
    "plugins": ["./my-plugin.ts"]
  }
}
```

## Example plugin

A plugin always has the same shape. It has a default export which is your plugin
object.

:::info

Deno provides type declarations for the lint plugins API.

All the typings are available under the `Deno.lint` namespace.

:::

```ts title="my-plugin.ts"
export default {
  // The name of your plugin. Will be shown in error output
  name: "my-plugin",
  // Object with rules. The property name is the rule name and
  // will be shown in the error output as well.
  rules: {
    "my-rule": {
      // Inside the `create(context)` method is where you'll put your logic.
      // It's called when a file is being linted.
      create(context) {
        // Return an AST visitor object
        return {
          // Here in this example we forbid any identifiers being named `_a`
          Identifier(node) {
            if (node.name === "_a") {
              // Report a lint error with a custom message
              context.report({
                node,
                message: "should be _b",
                // Optional: Provide a fix, which can be applied when
                // the user runs `deno lint --fix`
                fix(fixer) {
                  return fixer.replaceText(node, "_b");
                },
              });
            }
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
```

## Using selectors to match nodes

Writing code to match a specific node can sometimes become a bit tedious if you
write it in plain JavaScript. Sometimes this matching logic would be easier to
express via a selector, similar to CSS selectors. The using a string as the
property name in the returned visitor object, we can specify a custom selector.

```ts title="my-plugin.ts"
export default {
  name: "my-plugin",
  rules: {
    "my-rule": {
      create(context) {
        return {
          // Selectors can be used too. Here we check for
          // `require("...") calls.
          'CallExpression[callee.name="require"]'(node) {
            context.report({
              node,
              message: "Don't use require() calls to load modules",
            });
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
```

Note, that we can always refine our match further in JavaScript if the matching
logic is too complex to be expressed as a selector alone. The full list of the
supported syntax for selectors is:

| Syntax                 | Description                   |
| ---------------------- | ----------------------------- |
| `Foo + Foo`            | Next sibling selector         |
| `Foo > Bar`            | Child combinator              |
| `Foo ~ Bar`            | Subsequent sibling combinator |
| `Foo Bar`              | Descendant combinator         |
| `Foo[attr]`            | Attribute existance           |
| `Foo[attr.length < 2]` | Attribute value comparison    |
| `:first-child`         | First child pseudo-class      |
| `:last-child`          | Last child pseudo-class       |
| `:nth-child(2n + 1)`   | Nth-child speudo-class        |
| `:not(> Bar)`          | Not speudo-class              |
| `:is(> Bar)`           | Is speudo-class               |

## Running cleanup code

If your plugin requires running cleanup code after a file has been linted, you
can hook into the linter via the `destroy()` hook. It is called after a file has
been linted and just before the plugin context is destroyed.

```ts title="my-plugin.ts"
export default {
  name: "my-plugin",
  rules: {
    "my-rule": {
      create(context) {
        // ...
      },
      // Optional: Run code after a linting for a file is completed
      // and each rule context is destroyed.
      destroy() {
        // do some cleanup stuff if you need to
      },
    },
  },
} satisfies Deno.lint.Plugin;
```

:::caution

It is not safe to assume that your plugin code will be executed again for each
of the files linted.

Prefer not to keep a global state, and do cleanup in the `destroy` hook, in case
`deno lint` decides to reuse the existing plugin instance.

:::

## Excluding custom rules

Similar to built-in rules, you can disable custom rules provided by a plugin. To
do so, add it to the `lint.rules.exclude` key in `deno.json`. The format of a
custom lint rule is always `<plugin-name>/<rule-name>`.

```json title="deno.json"
{
  "lint": {
    "plugins": ["./my-plugin.ts"],
    "rules": {
      "exclude": ["my-plugin/my-rule"]
    }
  }
}
```

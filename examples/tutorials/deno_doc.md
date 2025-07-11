---
title: "Generating documentation with deno doc"
description: "Learn how to generate professional documentation for your Deno projects using the built-in deno doc command. This tutorial covers JSDoc comments, HTML output, linting, and best practices for documenting your code."
url: /examples/deno_doc_tutorial/
---

Good documentation is essential for any software project. It helps other
developers understand your code, makes maintenance easier, and improves the
overall quality of your project. Deno includes a built-in documentation
generator called `deno doc` that can automatically generate searchable
documentation from your TypeScript and JavaScript code.

`deno doc` works out of the box, with no setup required and can generate HTML,
JSON or terminal output. It leverages JSDoc comments for documentation and
automatically extracts type information from TypeScript type annotations in your
code.

:::info Automatic documentation with JSR

If you're publishing your package to
[JSR (JavaScript Registry)](https://jsr.io), you get beautiful documentation
automatically generated for free! JSR uses the same `deno doc` technology under
the hood to create searchable, web-based documentation for all published
packages. Simply publish your well-documented code with `deno publish` and JSR
handles the rest.

:::

## Setting up a sample project

Let's create a sample library to demonstrate `deno doc` features. We'll build a
simple mathematics utilities library with proper documentation.

````ts title="math.ts"
/**
 * A collection of mathematical utility functions.
 * @module
 */

/**
 * Adds two numbers together.
 *
 * @example
 * ```ts
 * import { add } from "./math.ts";
 *
 * const result = add(5, 3);
 * console.log(result); // 8
 * ```
 *
 * @param x The first number
 * @param y The second number
 * @returns The sum of x and y
 */
export function add(x: number, y: number): number {
  return x + y;
}

/**
 * Multiplies two numbers together.
 *
 * @example
 * ```ts
 * import { multiply } from "./math.ts";
 *
 * const result = multiply(4, 3);
 * console.log(result); // 12
 * ```
 *
 * @param x The first number
 * @param y The second number
 * @returns The product of x and y
 */
export function multiply(x: number, y: number): number {
  return x * y;
}

/**
 * Represents a 2D point in space.
 *
 * @example
 * ```ts
 * import { Point } from "./math.ts";
 *
 * const point = new Point(5, 10);
 * console.log(point.distance()); // 11.180339887498949
 * ```
 */
export class Point {
  /**
   * Creates a new Point instance.
   *
   * @param x The x-coordinate
   * @param y The y-coordinate
   */
  constructor(public x: number, public y: number) {}

  /**
   * Calculates the distance from the origin (0, 0).
   *
   * @returns The distance from the origin
   */
  distance(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculates the distance to another point.
   *
   * @param other The other point
   * @returns The distance between the two points
   */
  distanceTo(other: Point): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

/**
 * Configuration options for mathematical operations.
 */
export interface MathConfig {
  /** The precision for floating-point calculations */
  precision?: number;
  /** Whether to round results to integers */
  roundToInt?: boolean;
}

/**
 * Performs advanced mathematical operations with configuration.
 *
 * @example
 * ```ts
 * import { calculate } from "./math.ts";
 *
 * const result = calculate(10, 3, { precision: 2, roundToInt: false });
 * console.log(result); // 3.33
 * ```
 */
export function calculate(
  dividend: number,
  divisor: number,
  config: MathConfig = {},
): number {
  const { precision = 10, roundToInt = false } = config;

  let result = dividend / divisor;

  if (roundToInt) {
    result = Math.round(result);
  } else {
    result = Math.round(result * Math.pow(10, precision)) /
      Math.pow(10, precision);
  }

  return result;
}
````

## Basic documentation generation

The simplest way to generate documentation is to run `deno doc` with your source
files:

```bash
deno doc math.ts
```

This will output the documentation to your terminal, showing all exported
functions, classes, and interfaces with their JSDoc comments.

## Generating HTML documentation

To create a documentation website with HTML, CSS and JS, use the `--html` flag:

```bash
deno doc --html --name="Math Utilities" math.ts
```

This generates a static site in the `./docs/` directory. The site includes:

- A searchable interface
- Syntax highlighting
- Cross-references between symbols
- Mobile-friendly responsive design

You can also specify a custom output directory:

```bash
deno doc --html --name="Math Utilities" --output=./documentation/ math.ts
```

## Documentation linting

Use the `--lint` flag to check for documentation issues:

```bash
deno doc --lint math.ts
```

This will report several types of problems:

1. Missing JSDoc comments on exported functions, classes, or interfaces
2. Missing return types on functions
3. Unexported types referenced by exported symbols

Let's create a file with some documentation issues to see the linter in action:

```ts title="bad_example.ts"
// Missing JSDoc comment
export function badFunction(x) {
  return x * 2;
}

interface InternalType {
  value: string;
}

// References non-exported type
export function anotherFunction(param: InternalType) {
  return param.value;
}
```

Running `deno doc --lint bad_example.ts` will show errors for these issues.

## Working with multiple files

You can document multiple files at once:

```bash
deno doc --html --name="My Library" ./mod.ts ./utils.ts ./types.ts
```

For larger projects, create a main module file that re-exports everything:

````ts title="mod.ts"
/**
 * Math Utilities Library
 *
 * A comprehensive collection of mathematical functions and utilities.
 *
 * @example
 * ```ts
 * import { add, multiply, Point } from "./mod.ts";
 *
 * const sum = add(5, 3);
 * const product = multiply(4, 2);
 * const point = new Point(3, 4);
 * ```
 *
 * @module
 */

export * from "./math.ts";
````

Then generate documentation from the main module:

```bash
deno doc --html --name="Math Utilities" mod.ts
```

## JSON output for automation

Generate documentation in JSON format for use with other tools:

```bash
deno doc --json math.ts > documentation.json
```

The JSON output provides a low-level representation of your code's structure,
including symbol definitions and basic type information. This format is
primarily useful for building custom documentation tools or integrating with
other systems that need programmatic access to your code's API surface.

## Best practices for JSDoc comments

To get the most out of `deno doc`, follow these JSDoc best practices:

### 1. Use descriptive summaries

```ts
/**
 * Calculates the factorial of a number using recursion.
 *
 * @param n The number to calculate factorial for
 * @returns The factorial of n
 */
export function factorial(n: number): number {
  // Implementation...
}
```

### 2. Provide concrete examples

````ts
/**
 * Formats a number as currency.
 *
 * @example
 * ```ts
 * formatCurrency(123.456); // "$123.46"
 * formatCurrency(1000); // "$1,000.00"
 * ```
 *
 * @param amount The amount to format
 * @returns The formatted currency string
 */
export function formatCurrency(amount: number): string {
  // Implementation...
}
````

### 3. Document parameters and return values

```ts
/**
 * Validates an email address format.
 *
 * @param email The email address to validate
 * @returns true if valid, false otherwise
 * @throws {Error} When email is null or undefined
 */
export function validateEmail(email: string): boolean {
  // Implementation...
}
```

### 4. Use module-level documentation

```ts
/**
 * Email validation utilities.
 *
 * This module provides functions for validating and formatting email addresses
 * according to RFC 5322 standards.
 *
 * @module
 */
```

### 5. Mark deprecated or experimental features

```ts
/**
 * Legacy function for backward compatibility.
 *
 * @deprecated Use `newFunction()` instead
 * @param data The input data
 */
export function oldFunction(data: string): void {
  // Implementation...
}

/**
 * New experimental feature.
 *
 * @experimental This API may change in future versions
 * @param options Configuration options
 */
export function experimentalFunction(options: unknown): void {
  // Implementation...
}
```

## Integrating with CI/CD

You can integrate documentation generation into your continuous integration
pipeline:

```yaml title=".github/workflows/docs.yml"
name: Generate Documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Deno
        uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x

      - name: Generate documentation
        run: deno doc --html --name="My Library" --output=./docs/ mod.ts

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Configuration in deno.json

You can configure documentation generation in your `deno.json` file:

```json title="deno.json"
{
  "tasks": {
    "doc": "deno doc --html --name='Math Utilities' --output=./docs/ mod.ts",
    "doc:lint": "deno doc --lint mod.ts",
    "doc:json": "deno doc --json mod.ts > documentation.json"
  }
}
```

Then run documentation tasks easily:

```bash
deno task doc
deno task doc:lint
deno task doc:json
```

🦕 The `deno doc` command is a powerful tool for generating professional
documentation from your Deno projects.

Good documentation makes your code more maintainable and helps other developers
understand and use your projects effectively. With `deno doc`, creating
comprehensive documentation is just a command away!

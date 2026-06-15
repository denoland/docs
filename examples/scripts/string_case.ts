/**
 * @title Convert string case
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/text/doc/~/toCamelCase} Doc: @std/text toCamelCase
 * @resource {https://jsr.io/@std/text/doc/~/toKebabCase} Doc: @std/text toKebabCase
 * @group Standard library
 *
 * Identifiers, file names, CSS classes, and database columns all expect
 * different casing conventions. The @std/text package converts between
 * them from a single input, splitting words on spaces, dashes,
 * underscores, and existing case boundaries.
 */

import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from "jsr:@std/text";

// The same phrase rendered in the four common identifier styles.
const input = "shopping cart total";

console.log(toCamelCase(input)); // shoppingCartTotal
console.log(toKebabCase(input)); // shopping-cart-total
console.log(toSnakeCase(input)); // shopping_cart_total
console.log(toPascalCase(input)); // ShoppingCartTotal

// The converters also understand input that is already cased, so they
// can translate one convention into another.
console.log(toSnakeCase("getUserById")); // get_user_by_id
console.log(toKebabCase("HTTPServerError")); // http-server-error

// Sentence case and title case ship as unstable submodules, so their
// import paths carry an unstable- prefix until they stabilize.
import { toSentenceCase } from "jsr:@std/text/unstable-to-sentence-case";
import { toTitleCase } from "jsr:@std/text/unstable-to-title-case";

console.log(toSentenceCase("shopping cart total")); // Shopping cart total
console.log(toTitleCase("shopping cart total")); // Shopping Cart Total

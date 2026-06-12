/**
 * @title Extract front matter from markdown
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://jsr.io/@std/front-matter} @std/front-matter on JSR
 * @group Encoding
 *
 * Front matter is a metadata block at the top of a markdown file, fenced
 * by --- lines and usually written in YAML. Static site generators and
 * blog engines use it for titles, dates, and tags. The @std/front-matter
 * module parses it and hands back the document body separately.
 */
import { extractYaml, test } from "jsr:@std/front-matter";

// A typical markdown document with YAML front matter.
const markdown = `---
title: My first post
date: 2026-06-12
tags: [deno, markdown]
draft: false
---

# Hello

This is the body of the post.
`;

// test() checks whether a document begins with a front matter block at
// all, so you can handle plain markdown files gracefully.
console.log(test(markdown)); // true

// extractYaml returns the parsed attributes, the body with the block
// removed, and the raw front matter text. Type the attributes with a
// generic parameter to get typed access.
type PostMeta = {
  title: string;
  date: Date;
  tags: string[];
  draft: boolean;
};
const { attrs, body } = extractYaml<PostMeta>(markdown);

console.log(attrs.title); // My first post
console.log(attrs.tags); // [ "deno", "markdown" ]
console.log(body.trim().split("\n")[0]); // # Hello

// JSON and TOML front matter have matching extractors, fenced the same
// way but with the format name on the fence.
import { extractToml } from "jsr:@std/front-matter";

const tomlDoc = `---toml
title = "TOML works too"
---
Body text.
`;
console.log(extractToml<{ title: string }>(tomlDoc).attrs.title); // TOML works too

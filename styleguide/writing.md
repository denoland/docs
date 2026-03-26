---
title: "Deno Documentation Style Guide"
description: "Guidelines and best practices for writing clear, consistent, and helpful documentation for the Deno runtime and ecosystem."
---

This guide outlines the standards and best practices for writing documentation
for Deno. Following these guidelines helps ensure our documentation remains
consistent, clear, and helpful for all users.

## Document Structure

### Front Matter

Every Markdown file should begin with front matter that includes:

```yaml
---
title: "Descriptive Title"
description: "A concise summary (1-2 sentences) of the page content that will appear in search results and link previews."
oldUrl:  # Optional - used for redirects from previous documentation locations
- /previous/url/path/
---
```

**Title**: Concise but descriptive, enclosed in quotes.

**Description**: 1-2 sentences (140-160 characters) that summarize the page
content.

### Introduction paragraph

Begin each document with a brief introduction that explains:

- What the feature/concept is
- Why it's useful
- Who might need this information

### Content Organization

Organize content in a logical progression:

1. Basic concepts first
2. Common use cases
3. Advanced features
4. Reference information

## Writing Style

### Voice and Tone

- **Be conversational but professional** - Write as if you're explaining to a
  colleague
- **Use active voice** - "Deno provides..." rather than "...is provided by Deno"
- **Be direct** - Address the reader as "you"
- **Be concise** - Use simple sentences and avoid unnecessary words

### Technical Writing Conventions

- Define terms before using them
- Use consistent terminology throughout the documentation
- Avoid idioms and colloquialisms*that may confuse non-native English speakers

### Grammar and Mechanics

- Use American English spelling and conventions
- Write in present tense when possible
- Avoid contractions in formal explanations (use "cannot" instead of "can't")
- Use sentence case for headings (capitalize only the first word and proper
  nouns)

## Code Examples

### Format

- Always specify the language for syntax highlighting
- For TypeScript/JavaScript, use `ts` or `js` language identifiers
- Include file names when appropriate using the `title` attribute

````markdown
```ts title="example.ts"
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```
````

### Best Practices for Examples

- Keep examples simple and focused on demonstrating one concept
- Ensure all examples are functional and correct
- Include comments for complex or non-obvious code sections
- Show both basic and practical use cases
- For longer examples, build them incrementally

### Documentation Tests

For code blocks that should be tested:

- Ensure examples in documentation are correct and runnable
- Use triple backticks with language identifiers to enable testable code blocks
- Follow the guidelines in
  [Documentation Tests](/runtime/reference/documentation/)

## Formatting Elements

### Links

- Use descriptive link text that makes sense out of context
- For internal links, use relative paths, ending in a `/`:
  `/runtime/fundamentals/modules/`
- Link to relevant documentation when introducing new concepts

```markdown
[descriptive text](/path/to/page/)
```

### Lists

- Use ordered lists (1., 2., 3.) for sequential steps
- Use unordered lists (bullet points) for non-sequential items
- Keep list items parallel in structure
- Capitalize the first word of each item

### Admonitions (Notes, Tips, Warnings)

Use admonitions sparingly to highlight important information:

```markdown
:::note Important supplementary information. :::

:::info Informational content (styled like note). :::

:::tip Helpful advice for better usage. :::

:::caution Warn about potential issues or gotchas. :::

:::warning Critical warnings that require immediate attention. :::
```

### Tables

Use tables for presenting structured data:

```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## Specific Content Types

### Command Reference

When documenting CLI commands:

- Begin with a clear description of what the command does
- List all available flags and options
- Include examples showing common usage patterns
- When possible, show expected output

### API Documentation

For API documentation:

- Clearly define parameters and return values
- Specify types for all parameters
- Provide examples for common use cases
- Document potential errors or exceptions

### Tutorials

For tutorial-style documentation:

- Begin with prerequisites and what will be learned
- Break down into clear, numbered steps
- Provide complete code examples
- Explain the "why" behind each step, not just the "how"
- End with next steps or related resources

## Visual Elements

### Screenshots and Images

- Include alt text for all images
- Keep images up to date with the current UI
- Crop images to focus on relevant parts
- Use annotations to highlight important areas
- Ensure images are clear at different screen sizes

### Diagrams

- Use diagrams to explain complex concepts or flows
- Keep diagrams simple and focused on the key message
- Include text explanations that complement the diagram

## Inclusive Language

- Use gender-neutral language
- Avoid terminology with problematic historical connotations
- Be mindful of global audiences and avoid culture-specific references
- Follow the
  [inclusive code guidelines](https://chromium.googlesource.com/chromium/src/+/HEAD/styleguide/inclusive_code.md)

## Review Process

Before submitting documentation:

1. Verify technical accuracy
2. Check for clarity and readability
3. Ensure consistent formatting
4. Validate all links
5. Test all code examples
6. Review for typos and grammatical errors

## File Organization

- Place new files in the appropriate directory based on content type
- Use lowercase for filenames with words separated by underscores (e.g.,
  `setup_environment.md`)
- Follow the existing navigation structure when adding new pages

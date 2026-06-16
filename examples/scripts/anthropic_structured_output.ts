/**
 * @title Get structured JSON output from Claude
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://platform.claude.com/docs/en/build-with-claude/structured-outputs} Claude structured outputs
 * @resource {https://www.npmjs.com/package/@anthropic-ai/sdk} @anthropic-ai/sdk on npm
 * @group AI
 *
 * When you need machine-readable output, constrain Claude's response to a
 * JSON schema with output_config.format. The model returns JSON matching the
 * schema, so you can parse it directly instead of coaxing structure out of
 * prose or writing fragile string parsing. Set ANTHROPIC_API_KEY first.
 */

import Anthropic from "npm:@anthropic-ai/sdk";

const client = new Anthropic();

// Describe the exact shape you want back. Structured outputs require every
// object to set additionalProperties: false.
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    field: { type: "string" },
    languages: { type: "array", items: { type: "string" } },
  },
  required: ["name", "field", "languages"],
  additionalProperties: false,
};

const response = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  // output_config.format constrains the whole response to the schema.
  output_config: { format: { type: "json_schema", schema } },
  messages: [
    {
      role: "user",
      content:
        "Ada Lovelace was an English mathematician, regarded as the first " +
        "computer programmer.",
    },
  ],
});

// The response text is JSON that matches the schema, ready to parse.
const block = response.content.find((b) => b.type === "text");
if (block?.type === "text") {
  const person = JSON.parse(block.text);
  console.log(person);
  // { name: "Ada Lovelace", field: "mathematics", languages: ["English"] }
}

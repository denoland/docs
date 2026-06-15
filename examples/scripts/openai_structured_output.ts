/**
 * @title Get structured JSON output from OpenAI
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://platform.openai.com/docs/guides/structured-outputs} OpenAI structured outputs
 * @resource {https://www.npmjs.com/package/openai} openai on npm
 * @group AI
 *
 * When you need machine-readable output, constrain the response to a JSON
 * schema with response_format. The model returns JSON matching the schema, so
 * you can parse it directly instead of coaxing structure out of prose. Set
 * OPENAI_API_KEY before running.
 */

import OpenAI from "npm:openai";

const client = new OpenAI();

// Describe the exact shape you want back. Strict structured outputs require
// every property to be required and additionalProperties: false.
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

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content:
        "Ada Lovelace was an English mathematician, regarded as the first " +
        "computer programmer.",
    },
  ],
  // response_format constrains the reply to the schema.
  response_format: {
    type: "json_schema",
    json_schema: { name: "person", schema, strict: true },
  },
});

// The message content is JSON that matches the schema, ready to parse.
const person = JSON.parse(response.choices[0].message.content ?? "{}");
console.log(person);
// { name: "Ada Lovelace", field: "mathematics", languages: ["English"] }

/**
 * @title Stream a chat response from OpenAI
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://platform.openai.com/docs/api-reference/chat} OpenAI chat completions
 * @resource {https://www.npmjs.com/package/openai} openai on npm
 * @group AI
 *
 * The official OpenAI SDK runs in Deno straight from npm. This example streams
 * a chat response so tokens print as they arrive, which keeps long replies
 * responsive and avoids request timeouts. Set OPENAI_API_KEY before running.
 */

import OpenAI from "npm:openai";

// The client reads the API key from the OPENAI_API_KEY environment variable.
const client = new OpenAI();

// Passing stream: true returns an async iterable of partial chunks instead of
// one response at the end.
const stream = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "user", content: "In one sentence, what makes Deno distinctive?" },
  ],
  stream: true,
});

// Each chunk carries a small delta; print the text pieces as they arrive.
for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content;
  if (delta) Deno.stdout.writeSync(new TextEncoder().encode(delta));
}
console.log();

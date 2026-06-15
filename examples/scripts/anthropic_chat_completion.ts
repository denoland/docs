/**
 * @title Connect to Claude (Anthropic API)
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://www.npmjs.com/package/@anthropic-ai/sdk} @anthropic-ai/sdk on npm
 * @resource {https://docs.claude.com/en/api/overview} Claude API reference
 * @group AI
 *
 * The official Anthropic SDK runs in Deno straight from npm. This example
 * streams a chat response from Claude so tokens print as they arrive, which
 * keeps long replies responsive and avoids request timeouts. Set your key in
 * the ANTHROPIC_API_KEY environment variable before running.
 */

import Anthropic from "npm:@anthropic-ai/sdk";

// The client reads the API key from the ANTHROPIC_API_KEY environment variable
// by default, so there is nothing to pass to the constructor.
const client = new Anthropic();

// Open a streaming request. Streaming is the recommended default for anything
// that might produce a long reply: tokens arrive incrementally instead of in
// one large response at the end.
const stream = client.messages.stream({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "In one sentence, what makes Deno distinctive?" },
  ],
});

// The `text` event yields each text delta as the model produces it. Write the
// chunks straight to stdout so they render as a single, growing reply.
stream.on("text", (delta) => {
  Deno.stdout.writeSync(new TextEncoder().encode(delta));
});

// Wait for the stream to finish and read the complete message. The final
// message also carries token usage, which is useful for cost tracking.
const message = await stream.finalMessage();
console.log(`\n\nOutput tokens: ${message.usage.output_tokens}`);

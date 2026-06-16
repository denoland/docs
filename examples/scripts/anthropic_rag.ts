/**
 * @title RAG: ground Claude's answer in your documents
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://docs.voyageai.com/docs/embeddings} Voyage AI embeddings
 * @resource {https://www.npmjs.com/package/@anthropic-ai/sdk} @anthropic-ai/sdk on npm
 * @group AI
 *
 * Retrieval-augmented generation grounds an answer in your own data. Anthropic
 * has no embeddings endpoint, so this example embeds a small knowledge base
 * and the question with Voyage AI, finds the closest passages by cosine
 * similarity, and passes them to Claude as context. Set ANTHROPIC_API_KEY and
 * VOYAGE_API_KEY before running.
 */

import Anthropic from "npm:@anthropic-ai/sdk";

const anthropic = new Anthropic();

// A tiny knowledge base. In a real app these passages would live in a vector
// database rather than an array.
const documents = [
  "Deno is secure by default: network, file system, and environment access " +
  "must be granted explicitly with flags like --allow-net.",
  "Deno has a built-in test runner. Write Deno.test() and run `deno test`.",
  "Deno supports npm packages through the npm: specifier, for example " +
  "import express from 'npm:express'.",
];

// Embed text with Voyage AI's REST API. input_type marks whether the text is
// a stored document or a search query, which improves retrieval quality.
async function embed(
  input: string[],
  inputType: "document" | "query",
): Promise<number[][]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      authorization: `Bearer ${Deno.env.get("VOYAGE_API_KEY")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "voyage-3.5-lite",
      input,
      input_type: inputType,
    }),
  });
  if (!res.ok) {
    throw new Error(`Voyage error ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.data.map((d: { embedding: number[] }) => d.embedding);
}

// Cosine similarity scores how close two embedding vectors are.
function cosine(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

const question = "How do I run tests in Deno?";

// Embed the documents once (this is the "index") and the incoming question.
const docVectors = await embed(documents, "document");
const [queryVector] = await embed([question], "query");

// Rank documents by similarity to the question and keep the top two.
const retrieved = documents
  .map((text, i) => ({ text, score: cosine(queryVector, docVectors[i]) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 2);

// Hand the retrieved passages to Claude as context and ask it to answer from
// them, which keeps the response grounded in your data.
const context = retrieved.map((d) => `- ${d.text}`).join("\n");
const message = await anthropic.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: `Answer the question using only the context below.\n\n` +
        `Context:\n${context}\n\nQuestion: ${question}`,
    },
  ],
});

for (const block of message.content) {
  if (block.type === "text") console.log(block.text);
}

/**
 * @title RAG: ground an OpenAI answer in your documents
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://platform.openai.com/docs/guides/embeddings} OpenAI embeddings
 * @resource {https://www.npmjs.com/package/openai} openai on npm
 * @group AI
 *
 * Retrieval-augmented generation grounds an answer in your own data. This
 * example embeds a small knowledge base and the question with OpenAI's
 * embeddings API, finds the closest passages by cosine similarity, and passes
 * them to the chat model as context. Set OPENAI_API_KEY before running.
 */

import OpenAI from "npm:openai";

const client = new OpenAI();

// A tiny knowledge base. In a real app these passages would live in a vector
// database rather than an array.
const documents = [
  "Deno is secure by default: network, file system, and environment access " +
  "must be granted explicitly with flags like --allow-net.",
  "Deno has a built-in test runner. Write Deno.test() and run `deno test`.",
  "Deno supports npm packages through the npm: specifier, for example " +
  "import express from 'npm:express'.",
];

// Embed an array of strings and return their vectors.
async function embed(input: string[]): Promise<number[][]> {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });
  return res.data.map((d) => d.embedding);
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
const docVectors = await embed(documents);
const [queryVector] = await embed([question]);

// Rank documents by similarity to the question and keep the top two.
const retrieved = documents
  .map((text, i) => ({ text, score: cosine(queryVector, docVectors[i]) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 2);

// Hand the retrieved passages to the model as context and ask it to answer
// from them, which keeps the response grounded in your data.
const context = retrieved.map((d) => `- ${d.text}`).join("\n");
const completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: `Answer the question using only the context below.\n\n` +
        `Context:\n${context}\n\nQuestion: ${question}`,
    },
  ],
});

console.log(completion.choices[0].message.content);

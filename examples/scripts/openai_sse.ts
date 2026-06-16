/**
 * @title Stream an OpenAI response to the browser
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events} MDN: Server-sent events
 * @resource {https://www.npmjs.com/package/openai} openai on npm
 * @group AI
 *
 * A chat UI needs tokens to appear as the model produces them. This server
 * streams an OpenAI response to the browser over server-sent events: the
 * browser opens an EventSource, and each delta from the OpenAI SDK is
 * forwarded as one SSE message. Open http://localhost:8000 after starting it,
 * with OPENAI_API_KEY set.
 */

import OpenAI from "npm:openai";

const client = new OpenAI();

// A minimal page that opens an EventSource and appends each token as it
// arrives. Deltas are JSON-encoded on the server, so newlines survive.
const PAGE = `<!doctype html>
<meta charset="utf-8" />
<title>Streaming OpenAI</title>
<pre id="out"></pre>
<script>
  const out = document.getElementById("out");
  const source = new EventSource("/chat");
  source.onmessage = (e) => { out.textContent += JSON.parse(e.data); };
  source.addEventListener("done", () => source.close());
</script>`;

function handler(req: Request): Response {
  const url = new URL(req.url);

  // Serve the page itself at the root.
  if (url.pathname !== "/chat") {
    return new Response(PAGE, { headers: { "content-type": "text/html" } });
  }

  // The prompt can come from the query string; fall back to a default.
  const prompt = url.searchParams.get("q") ??
    "In two sentences, explain why streaming improves a chat UI.";

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const stream = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      });

      try {
        // Forward every delta as one SSE message. JSON.stringify keeps
        // newlines from breaking the `data:` framing.
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(delta)}\n\n`),
            );
          }
        }
        // A named event lets the browser close the connection cleanly.
        controller.enqueue(encoder.encode('event: done\ndata: ""\n\n'));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${JSON.stringify(message)}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  // The text/event-stream content type is what makes this SSE; no-store keeps
  // proxies from buffering the tokens.
  return new Response(body, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-store",
    },
  });
}

Deno.serve(handler);

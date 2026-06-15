/**
 * @title Build an agent with tool use
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview} Claude tool use overview
 * @resource {https://www.npmjs.com/package/@anthropic-ai/sdk} @anthropic-ai/sdk on npm
 * @group AI
 *
 * Tool use lets Claude call functions you define and act on the results. You
 * describe each tool with a JSON schema, and when Claude decides to use one it
 * returns a tool_use request instead of a final answer. You run the tool, send
 * the result back, and repeat until Claude is done. This loop is the core of
 * an agent. Set ANTHROPIC_API_KEY before running.
 */

import Anthropic from "npm:@anthropic-ai/sdk";

const client = new Anthropic();

// Describe the tool with a JSON schema. A clear description and prescriptive
// "when to call it" wording help Claude decide to use it at the right time.
const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description:
      "Get the current weather for a city. Call this whenever the user asks " +
      "about weather conditions.",
    input_schema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name, e.g. Tokyo" },
      },
      required: ["city"],
    },
  },
];

// The actual implementation. In a real app this would call a weather API; here
// it returns canned data so the example runs without extra setup.
function getWeather(city: string): string {
  const data: Record<string, string> = {
    Tokyo: "18°C, clear",
    Paris: "12°C, light rain",
    Oslo: "4°C, snow",
  };
  return data[city] ?? `No data for ${city}`;
}

// The API is stateless, so we carry the full conversation in `messages`.
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "Compare the weather in Tokyo and Oslo right now." },
];

// Agent loop: keep calling the model until it stops requesting tools.
while (true) {
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    tools,
    messages,
  });

  // No tool requested means Claude produced its final answer.
  if (response.stop_reason !== "tool_use") {
    for (const block of response.content) {
      if (block.type === "text") console.log(block.text);
    }
    break;
  }

  // Record the assistant turn; it holds the tool_use blocks we must answer.
  messages.push({ role: "assistant", content: response.content });

  // Run every requested tool and gather the results.
  const toolResults: Anthropic.ToolResultBlockParam[] = [];
  for (const block of response.content) {
    if (block.type === "tool_use" && block.name === "get_weather") {
      const { city } = block.input as { city: string };
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: getWeather(city),
      });
    }
  }

  // Feed the results back so Claude can continue from where it left off.
  messages.push({ role: "user", content: toolResults });
}

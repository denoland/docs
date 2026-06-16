/**
 * @title Build an agent with OpenAI function calling
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://platform.openai.com/docs/guides/function-calling} OpenAI function calling
 * @resource {https://www.npmjs.com/package/openai} openai on npm
 * @group AI
 *
 * Function calling lets the model call functions you define and act on the
 * results. You describe each tool with a JSON schema; when the model decides
 * to use one it returns a tool call instead of a final answer. You run it,
 * send the result back, and repeat until the model is done. This loop is the
 * core of an agent. Set OPENAI_API_KEY before running.
 */

import OpenAI from "npm:openai";

const client = new OpenAI();

// Describe the tool with a JSON schema and a prescriptive description so the
// model knows when to call it.
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description:
        "Get the current weather for a city. Call this whenever the user " +
        "asks about weather conditions.",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name, e.g. Tokyo" },
        },
        required: ["city"],
      },
    },
  },
];

// The actual implementation. A real app would call a weather API here.
function getWeather(city: string): string {
  const data: Record<string, string> = {
    Tokyo: "18°C, clear",
    Oslo: "4°C, snow",
  };
  return data[city] ?? `No data for ${city}`;
}

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  { role: "user", content: "Compare the weather in Tokyo and Oslo right now." },
];

// Agent loop: keep calling the model until it stops requesting tools.
while (true) {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
  });
  const message = response.choices[0].message;

  // Record the assistant turn; it holds any tool calls we must answer.
  messages.push(message);

  // No tool calls means the model produced its final answer.
  if (!message.tool_calls) {
    console.log(message.content);
    break;
  }

  // Run each requested tool and append its result as a tool message.
  for (const call of message.tool_calls) {
    if (call.type !== "function") continue;
    const { city } = JSON.parse(call.function.arguments);
    messages.push({
      role: "tool",
      tool_call_id: call.id,
      content: getWeather(city),
    });
  }
}

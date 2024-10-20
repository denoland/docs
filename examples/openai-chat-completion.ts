/**
 * @title Connect to OpenAI: Chat Completion
 * @difficulty intermediate
 * @tags cli, web
 * @run --allow-net --allow-env <url>
 * @resource {https://deno.land/x/openai} OpenAI module on deno.land/x
 * @group Basics
 *
 * This example demonstrates how to interact with OpenAI's chat completions API
 * using Deno, where we send a user prompt and receive a response from the GPT-4 model.
 */

// Import the OpenAI module from the Deno third-party library
import { OpenAI } from "https://deno.land/x/openai@v4.68.1/mod.ts";

// Create an OpenAI client by providing the API key stored in an environment variable. (Make sure your API key is set as an environment variable)
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});

// Define the user prompt for generating a response
const userPrompt = "What are some cool things to do in fall?";

// Send the user prompt and system message to OpenAI for chat completion.
const completion = await openai.chat.completions.create({
  model: "gpt-4", // Specify the GPT-4 (or any other valid) model for the completion
  messages: [
    { role: "system", content: "You are a helpful assistant." }, // System message setting the role
    { role: "user", content: userPrompt }, // User's input prompt
  ],
});

// Extract and log the assistant's response (text) from the first choice in the completion result
console.log("Response from OpenAI:", completion.choices[0].message.content);

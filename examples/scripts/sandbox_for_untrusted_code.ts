/**
 * @title Spin up a sandbox to run untrusted code
 * @difficulty beginner
 * @tags sandbox
 * @run -A --env-file <url>
 * @resource {https://docs.deno.com/sandbox/} Deno Deploy Sandbox
 * @group Deno Deploy
 *
 * Deno Deploy's Sandbox API lets you create secure microVMs to run untrusted code safely.
 * In this example, we ask Claude to generate a Deno script that fetches the current Bitcoin price,
 * then run that script inside a sandbox with strict resource limits and no access to the host environment.
 */

// Import the Anthropic SDK and the Deno Sandbox SDK.
import Anthropic from "npm:@anthropic-ai/sdk";
import { Sandbox } from "jsr:@deno/sandbox";

// Create an Anthropic client.
// It automatically picks up ANTHROPIC_API_KEY from your environment.
const client = new Anthropic();

// Ask Claude to write some code for us wrapped in a markdown code block.
const response = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content:
      "Write a Deno script that fetches the current Bitcoin price from the CoinGecko API and prints it.",
  }],
});

// Take the generated code out of Claude's response.
// Check it's a text block, then strip the markdown
// fences to get the raw source.
const firstBlock = response.content[0];
if (firstBlock.type !== "text") {
  throw new Error(`Unexpected content type: ${firstBlock.type}`);
}
const generatedCode = extractCode(firstBlock.text);

// Create a sandbox .
await using sandbox = await Sandbox.create();

// Write the AI-generated code into the sandbox filesystem.
await sandbox.fs.writeTextFile("/tmp/generated.ts", generatedCode);

// Run the code inside the sandbox with Deno.
// stdout and stderr are piped so we can capture and display them.
const child = await sandbox.spawn("deno", {
  args: [
    "run",
    "--allow-net=api.coingecko.com", // Only the specific host we expect
    "/tmp/generated.ts",
  ],
  stdout: "piped",
  stderr: "piped",
});

// AI-generated code could accidentally (or maliciously) loop forever —
// this ensures we kill the process after 10 seconds no matter what.
const timeout = setTimeout(() => child.kill(), 10_000);

// Wait for the process to finish and print the results.
// output.stdoutText / stderrText are pre-decoded UTF-8 strings.
// output.status.success is true only if the exit code was 0.
try {
  const output = await child.output();
  console.log("Output:\n", output.stdoutText ?? "No output");
  if (!output.status.success) {
    console.error("Error:\n", output.stderrText ?? "No error output");
  }
} finally {
  clearTimeout(timeout);
}

// Helper: extract the first code block from a markdown string.
// Falls back to returning the raw text if no fences are found.
function extractCode(text: string): string {
  const match = text.match(
    /```(?:typescript|ts|javascript|js)?\n([\s\S]*?)```/,
  );
  return match ? match[1] : text;
}

/**
 * @title Build an MCP server
 * @difficulty intermediate
 * @tags cli
 * @resource {https://modelcontextprotocol.io/} Model Context Protocol
 * @resource {https://github.com/modelcontextprotocol/typescript-sdk} MCP TypeScript SDK
 * @group AI
 *
 * The Model Context Protocol (MCP) is the standard way to expose tools and
 * data to AI assistants like Claude. An MCP server advertises tools the
 * model can call; the official TypeScript SDK runs in Deno through npm.
 * This server exposes a single tool over stdio, the transport desktop AI
 * clients use to launch and talk to local servers.
 */
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "npm:zod";

// A server has a name and version that clients use to identify it.
const server = new McpServer({
  name: "dinosaur-facts",
  version: "1.0.0",
});

// Register a tool the model can call. The inputSchema is a Zod schema: the
// SDK validates arguments against it and advertises the shape to the
// client, so the model knows what to pass. The handler returns content
// blocks, here a single piece of text.
const facts: Record<string, string> = {
  tyrannosaurus: "Tyrannosaurus rex could bite with 12,800 pounds of force.",
  velociraptor: "Velociraptor was about the size of a turkey.",
};

server.registerTool(
  "get_dinosaur_fact",
  {
    description: "Get a fact about a given dinosaur",
    inputSchema: { name: z.string().describe("The dinosaur's name") },
  },
  ({ name }: { name: string }) => {
    const fact = facts[name.toLowerCase()] ?? `No facts about ${name} yet.`;
    return { content: [{ type: "text", text: fact }] };
  },
);

// Connect the server to a transport. StdioServerTransport reads JSON-RPC
// messages from stdin and writes replies to stdout, which is how a desktop
// client runs the server as a subprocess. The server now waits for
// requests; it prints nothing on its own, so keep logging off stdout.
const transport = new StdioServerTransport();
await server.connect(transport);

// To use this server with Claude Desktop, add it to the client config and
// point the command at Deno:
//
//   {
//     "mcpServers": {
//       "dinosaur-facts": {
//         "command": "deno",
//         "args": ["run", "-R", "mcp_server.ts"]
//       }
//     }
//   }
//
// Or inspect it interactively with: npx @modelcontextprotocol/inspector

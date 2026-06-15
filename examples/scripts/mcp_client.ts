/**
 * @title Connect to an MCP server from a client
 * @difficulty intermediate
 * @tags cli
 * @run -R <url>
 * @resource {https://modelcontextprotocol.io/} Model Context Protocol
 * @resource {https://github.com/modelcontextprotocol/typescript-sdk} MCP TypeScript SDK
 * @group AI
 *
 * The other side of the Model Context Protocol: a client connects to a
 * server, discovers the tools it advertises, and calls them. This example
 * links a client to a small server over an in-memory transport so it runs on
 * its own. In practice the server is a separate process reached over stdio or
 * HTTP. See the "Build an MCP server" example for the server side.
 */

import { Client } from "npm:@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "npm:@modelcontextprotocol/sdk/inMemory.js";
import { z } from "npm:zod";

// A minimal server so the client has something to talk to.
const server = new McpServer({ name: "dinosaur-facts", version: "1.0.0" });
server.registerTool(
  "get_dinosaur_fact",
  {
    description: "Get a fact about a given dinosaur",
    inputSchema: { name: z.string().describe("The dinosaur's name") },
  },
  ({ name }: { name: string }) => ({
    content: [{ type: "text", text: `${name} was a dinosaur.` }],
  }),
);

// A client identifies itself with a name and version, like the server does.
const client = new Client({ name: "facts-client", version: "1.0.0" });

// A linked pair wires the two transports together in memory, with no
// subprocess or network. Connect each side to its end of the pair.
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
await server.connect(serverTransport);
await client.connect(clientTransport);

// Discover what the server offers. Each tool carries a name, description, and
// input schema, which is how an AI client knows what it can call.
const { tools } = await client.listTools();
console.log("Available tools:", tools.map((t: { name: string }) => t.name));

// Call a tool by name with arguments matching its schema.
const result = await client.callTool({
  name: "get_dinosaur_fact",
  arguments: { name: "Velociraptor" },
});
console.log(result.content);

// Close the connection when done.
await client.close();

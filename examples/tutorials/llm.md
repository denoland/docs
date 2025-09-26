---
title: "Build a Real-time LLM Chat App with Deno"
description: "Learn how to integrate Large Language Models (LLM) with Deno to create an interactive roleplay chat application with AI characters using OpenAI or Anthropic APIs."
url: /examples/llm_tutorial/
---

Large Language Models (LLMs) like OpenAI's GPT and Anthropic's Claude are
powerful tools for creating intelligent, conversational applications. In this
tutorial, we'll build a real-time chat application where AI characters powered
by LLMs interact with users in a roleplay game setting.

You can see the code for the
[finished app on GitHub](https://github.com/denoland/tutorial-with-llm).

:::info Deploy your own

Want to skip the tutorial and deploy the finished app right now? Click the
button below to instantly deploy your own copy of the complete LLM chat
application to Deno Deploy. You'll get a live, working application that you can
customize and modify as you learn!

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/tutorial-with-llm&mode=dynamic&entrypoint=main.ts&install=deno+install)

Once you have deployed, add your `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in the
project "Settings".

:::

## Initialize a new project

First, create a new directory for your project and initialize it:

```bash
mkdir deno-llm-chat
cd deno-llm-chat
deno init
```

## Project structure

We'll create a modular structure that separates concerns between LLM
integration, game logic, and server management:

```sh
├── main.ts                 # Main server entry point
├── main_test.ts            # Test file
├── deno.json               # Deno configuration
├── .env                    # Environment variables (API keys)
├── src/
│   ├── config/
│   │   ├── characters.ts   # Character configurations and presets
│   │   └── scenarios.ts    # Pre-defined scenario templates
│   ├── game/
│   │   ├── GameManager.ts  # Core game logic and state management
│   │   └── Character.ts    # AI character implementation
│   ├── llm/
│   │   └── LLMProvider.ts  # LLM integration layer (OpenAI/Anthropic)
│   └── server/
│       └── WebSocketHandler.ts # Real-time communication
└── static/
    ├── index.html         # Web interface
    ├── app.js            # Frontend JavaScript
    └── styles.css        # Application styling
```

## Set up dependencies

Add the required dependencies to your `deno.json`:

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run -A --env-file --watch main.ts",
    "start": "deno run --allow-net --allow-env --allow-read main.ts",
    "test": "deno test --allow-net --allow-env"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
    "@std/http": "jsr:@std/http@1",
    "@std/uuid": "jsr:@std/uuid@1",
    "@std/json": "jsr:@std/json@1"
  },
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.asynciterable",
      "deno.ns"
    ]
  }
}
```

## Configure environment variables

Create a `.env` file for your API keys. The application supports both OpenAI and
Anthropic. Comment out the config that you won't be using with a `#`.

```bash title=".env"
# Choose one of the following LLM providers:

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# OR Anthropic Configuration  
# ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Server Configuration (optional)
PORT=8000
```

You can get API keys from:

- [OpenAI Platform](https://platform.openai.com/api-keys)
- [Anthropic Console](https://console.anthropic.com/)

## Build the LLM Provider

The core of our application is the LLM provider that handles communication with
AI services. Create `src/llm/LLMProvider.ts`:

```typescript title="src/llm/LLMProvider.ts"
export interface LLMConfig {
  provider: "openai" | "anthropic" | "mock";
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class LLMProvider {
  private config: LLMConfig;
  private rateLimitedUntil: number = 0;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(config?: Partial<LLMConfig>) {
    const apiKey = config?.apiKey ||
      Deno.env.get("OPENAI_API_KEY") ||
      Deno.env.get("ANTHROPIC_API_KEY");

    // Auto-detect provider based on available API keys
    let provider = config?.provider;
    if (!provider && apiKey) {
      if (Deno.env.get("OPENAI_API_KEY")) {
        provider = "openai";
      } else if (Deno.env.get("ANTHROPIC_API_KEY")) {
        provider = "anthropic";
      }
    }

    this.config = {
      provider: provider || "mock",
      model: provider === "anthropic"
        ? "claude-3-haiku-20240307"
        : "gpt-3.5-turbo",
      maxTokens: 150,
      temperature: 0.8,
      ...config,
      apiKey,
    };

    console.log(`LLM Provider initialized: ${this.config.provider}`);
  }

  async generateResponse(prompt: string): Promise<string> {
    // Check rate limiting
    if (this.rateLimitedUntil > Date.now()) {
      console.warn("Rate limited, using mock response");
      return this.mockResponse(prompt);
    }

    try {
      switch (this.config.provider) {
        case "openai":
          return await this.callOpenAI(prompt);
        case "anthropic":
          return await this.callAnthropic(prompt);
        case "mock":
        default:
          return this.mockResponse(prompt);
      }
    } catch (error) {
      console.error("LLM API error:", error);

      if (this.shouldRetry(error)) {
        this.retryCount++;
        if (this.retryCount <= this.maxRetries) {
          console.log(`Retrying... (${this.retryCount}/${this.maxRetries})`);
          await this.delay(1000 * this.retryCount);
          return this.generateResponse(prompt);
        }
      }

      return this.mockResponse(prompt);
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    this.retryCount = 0; // Reset on success
    return data.choices[0].message.content.trim();
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.config.apiKey!,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        messages: [{ role: "user", content: prompt }],
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    this.retryCount = 0; // Reset on success
    return data.content[0].text.trim();
  }

  private mockResponse(prompt: string): string {
    const responses = [
      "I understand! Let me think about this...",
      "That's an interesting approach to the situation.",
      "I see what you're getting at. Here's what I think...",
      "Fascinating! I would approach it this way...",
      "Good point! That gives me an idea...",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private shouldRetry(error: any): boolean {
    // Retry on rate limits and temporary server errors
    const errorMessage = error.message?.toLowerCase() || "";
    return errorMessage.includes("rate limit") ||
      errorMessage.includes("429") ||
      errorMessage.includes("500") ||
      errorMessage.includes("502") ||
      errorMessage.includes("503");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

In this file we set an LLM provider, this allows us to easily switch between
different LLM APIs or mock responses for testing. We also add a retry mechanism
for handling API errors.

## Create AI Characters

Characters are the heart of our roleplay application. Create
`src/game/Character.ts`:

```typescript title="src/game/Character.ts"
import { LLMProvider } from "../llm/LLMProvider.ts";

export class Character {
  public name: string;
  public class: string;
  public personality: string;
  public conversationHistory: string[] = [];
  private llmProvider: LLMProvider;

  constructor(
    name: string,
    characterClass: string,
    personality: string,
    llmProvider: LLMProvider,
  ) {
    this.name = name;
    this.class = characterClass;
    this.personality = personality;
    this.llmProvider = llmProvider;
  }

  async generateResponse(
    context: string,
    userMessage: string,
  ): Promise<string> {
    // Build the character's prompt with personality and context
    const characterPrompt = `
You are ${this.name}, a ${this.class} with this personality: ${this.personality}

Context: ${context}

Recent conversation:
${this.conversationHistory.slice(-3).join("\n")}

User message: ${userMessage}

Respond as ${this.name} in character. Keep responses under 150 words and maintain your personality traits. Be engaging and helpful to advance the roleplay scenario.
        `.trim();

    try {
      const response = await this.llmProvider.generateResponse(characterPrompt);

      // Add to conversation history
      this.conversationHistory.push(`User: ${userMessage}`);
      this.conversationHistory.push(`${this.name}: ${response}`);

      // Keep history manageable
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return response;
    } catch (error) {
      console.error(`Error generating response for ${this.name}:`, error);
      return `*${this.name} seems lost in thought and doesn't respond*`;
    }
  }

  getCharacterInfo() {
    return {
      name: this.name,
      class: this.class,
      personality: this.personality,
    };
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}
```

Here we define the `Character` class, which represents each player character in
the game. This class will handle generating responses based on the character's
personality and the current game context.

## Set up character configurations

Create predefined character templates in `src/config/characters.ts`:

```typescript title="src/config/characters.ts"
export interface CharacterConfig {
  name: string;
  class: string;
  personality: string;
  emoji?: string;
  backstory?: string;
}

export const defaultCharacters: CharacterConfig[] = [
  {
    name: "Tharin",
    emoji: "⚔️",
    class: "Fighter",
    personality:
      "Brave and loyal team leader, always ready to protect allies. Takes charge in dangerous situations but listens to party input.",
    backstory: "A former city guard seeking adventure and justice.",
  },
  {
    name: "Lyra",
    emoji: "🔮",
    class: "Wizard",
    personality:
      "Curious and analytical strategist, loves solving puzzles. Uses magic creatively to support the party.",
    backstory: "A scholar of ancient magic seeking forgotten spells.",
  },
  {
    name: "Finn",
    emoji: "🗡️",
    class: "Rogue",
    personality:
      "Witty and sneaky scout, prefers clever solutions. Acts quickly and adapts to what allies need.",
    backstory: "A former street thief now using skills for good.",
  },
];
```

These templates are what the `Character` class will use to instantiate each
character with their unique traits. The LLM will use these traits to generate
responses that are consistent with each character's personality and backstory.

## Build the Game Manager

The Game Manager coordinates characters and maintains game state. Create
`src/game/GameManager.ts`:

```typescript title="src/game/GameManager.ts"
import { Character } from "./Character.ts";
import { LLMProvider } from "../llm/LLMProvider.ts";

export interface GameState {
  id: string;
  gmPrompt: string;
  characters: Character[];
  messages: GameMessage[];
  currentTurn: number;
  isActive: boolean;
  createdAt: Date;
}

export interface GameMessage {
  id: string;
  speaker: string;
  message: string;
  timestamp: Date;
  type: "gm" | "character" | "system";
}

export interface StartGameRequest {
  gmPrompt: string;
  characters: Array<{
    name: string;
    class: string;
    personality: string;
  }>;
}

export class GameManager {
  private games: Map<string, GameState> = new Map();
  private llmProvider: LLMProvider;

  constructor() {
    this.llmProvider = new LLMProvider();
  }

  async startNewGame(
    gmPrompt: string,
    characterConfigs: StartGameRequest["characters"],
  ): Promise<string> {
    const gameId = crypto.randomUUID();

    // Create characters with their LLM personalities
    const characters = characterConfigs.map((config) =>
      new Character(
        config.name,
        config.class,
        config.personality,
        this.llmProvider,
      )
    );

    const gameState: GameState = {
      id: gameId,
      gmPrompt,
      characters,
      messages: [],
      currentTurn: 0,
      isActive: true,
      createdAt: new Date(),
    };

    this.games.set(gameId, gameState);

    // Add initial system message
    this.addMessage(gameId, {
      speaker: "System",
      message: `Game started! Players: ${
        characters.map((c) => c.name).join(", ")
      }`,
      type: "system",
    });

    console.log(`New game started: ${gameId}`);
    return gameId;
  }

  async handlePlayerMessage(
    gameId: string,
    message: string,
  ): Promise<GameMessage[]> {
    const game = this.games.get(gameId);
    if (!game || !game.isActive) {
      throw new Error("Game not found or inactive");
    }

    // Add player message
    this.addMessage(gameId, {
      speaker: "Player",
      message,
      type: "gm",
    });

    // Generate responses from each character
    const responses: GameMessage[] = [];

    for (const character of game.characters) {
      try {
        const context = this.buildContext(game);
        const response = await character.generateResponse(context, message);

        const characterMessage = this.addMessage(gameId, {
          speaker: character.name,
          message: response,
          type: "character",
        });

        responses.push(characterMessage);

        // Small delay between character responses for realism
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error getting response from ${character.name}:`, error);
      }
    }

    game.currentTurn++;
    return responses;
  }

  private buildContext(game: GameState): string {
    const recentMessages = game.messages.slice(-5);
    const context = [
      `Scenario: ${game.gmPrompt}`,
      `Current turn: ${game.currentTurn}`,
      "Recent events:",
      ...recentMessages.map((m) => `${m.speaker}: ${m.message}`),
    ].join("\n");

    return context;
  }

  private addMessage(
    gameId: string,
    messageData: Omit<GameMessage, "id" | "timestamp">,
  ): GameMessage {
    const game = this.games.get(gameId);
    if (!game) throw new Error("Game not found");

    const message: GameMessage = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...messageData,
    };

    game.messages.push(message);
    return message;
  }

  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  getActiveGames(): string[] {
    return Array.from(this.games.entries())
      .filter(([_, game]) => game.isActive)
      .map(([id, _]) => id);
  }

  endGame(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (game) {
      game.isActive = false;
      console.log(`Game ended: ${gameId}`);
      return true;
    }
    return false;
  }
}
```

The game manager will handle all game-related logic, including starting new
games, processing player messages, and managing game state. When a player sends
a message, the game manager will route it to the appropriate character for
response generation.

## Add WebSocket Support

Real-time communication makes the roleplay experience more engaging. Create
`src/server/WebSocketHandler.ts`:

```typescript title="src/server/WebSocketHandler.ts"
import { GameManager } from "../game/GameManager.ts";

export interface WebSocketMessage {
  type: "start_game" | "send_message" | "join_game" | "get_game_state";
  gameId?: string;
  data?: any;
}

export class WebSocketHandler {
  private gameManager: GameManager;
  private connections: Map<string, WebSocket> = new Map();

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  handleConnection(request: Request): Response {
    const { socket, response } = Deno.upgradeWebSocket(request);

    const connectionId = crypto.randomUUID();
    this.connections.set(connectionId, socket);

    socket.onopen = () => {
      console.log(`WebSocket connection opened: ${connectionId}`);
      this.sendMessage(socket, {
        type: "connection",
        data: { connectionId, message: "Connected to LLM Chat server" },
      });
    };

    socket.onmessage = async (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        await this.handleMessage(socket, message);
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
        this.sendError(socket, "Invalid message format");
      }
    };

    socket.onclose = () => {
      console.log(`WebSocket connection closed: ${connectionId}`);
      this.connections.delete(connectionId);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${connectionId}:`, error);
    };

    return response;
  }

  private async handleMessage(socket: WebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case "start_game":
        await this.handleStartGame(socket, message.data);
        break;
      case "send_message":
        await this.handleSendMessage(socket, message);
        break;
      case "get_game_state":
        await this.handleGetGameState(socket, message.gameId!);
        break;
      default:
        this.sendError(socket, `Unknown message type: ${message.type}`);
    }
  }

  private async handleStartGame(socket: WebSocket, data: any) {
    try {
      const { gmPrompt, characters } = data;
      const gameId = await this.gameManager.startNewGame(gmPrompt, characters);

      this.sendMessage(socket, {
        type: "game_started",
        data: {
          gameId,
          message:
            "Game started successfully! You can now send messages to interact with your characters.",
        },
      });
    } catch (error) {
      this.sendError(socket, `Failed to start game: ${error.message}`);
    }
  }

  private async handleSendMessage(
    socket: WebSocket,
    message: WebSocketMessage,
  ) {
    try {
      const { gameId, data } = message;
      if (!gameId) {
        this.sendError(socket, "Game ID required");
        return;
      }

      const responses = await this.gameManager.handlePlayerMessage(
        gameId,
        data.message,
      );

      this.sendMessage(socket, {
        type: "character_responses",
        data: { gameId, responses },
      });
    } catch (error) {
      this.sendError(socket, `Failed to process message: ${error.message}`);
    }
  }

  private async handleGetGameState(socket: WebSocket, gameId: string) {
    try {
      const game = this.gameManager.getGame(gameId);
      if (!game) {
        this.sendError(socket, "Game not found");
        return;
      }

      this.sendMessage(socket, {
        type: "game_state",
        data: {
          gameId,
          characters: game.characters.map((c) => c.getCharacterInfo()),
          messages: game.messages.slice(-10), // Last 10 messages
          isActive: game.isActive,
        },
      });
    } catch (error) {
      this.sendError(socket, `Failed to get game state: ${error.message}`);
    }
  }

  private sendMessage(socket: WebSocket, message: any) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  private sendError(socket: WebSocket, error: string) {
    this.sendMessage(socket, {
      type: "error",
      data: { error },
    });
  }
}
```

Here we set up the WebSocket server to handle connections and messages.
Websockets allow for real-time communication between the client and server,
making them ideal for interactive applications like a chat app, or game. We send
messages back and forth between the client and server to keep the game state in
sync.

## Create the main server

Now let's tie everything together in `main.ts`:

```typescript title="main.ts"
import { GameManager } from "./src/game/GameManager.ts";
import { WebSocketHandler } from "./src/server/WebSocketHandler.ts";
import { defaultCharacters } from "./src/config/characters.ts";

const gameManager = new GameManager();
const wsHandler = new WebSocketHandler(gameManager);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Handle WebSocket connections
  if (req.headers.get("upgrade") === "websocket") {
    return wsHandler.handleConnection(req);
  }

  // Serve static files and API endpoints
  switch (url.pathname) {
    case "/":
      return new Response(await getIndexHTML(), {
        headers: { "content-type": "text/html" },
      });

    case "/api/characters":
      return new Response(JSON.stringify(defaultCharacters), {
        headers: { "content-type": "application/json" },
      });

    case "/api/game/start":
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const gameId = await gameManager.startNewGame(
            body.gmPrompt,
            body.characters,
          );
          return new Response(JSON.stringify({ gameId }), {
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 400,
              headers: { "content-type": "application/json" },
            },
          );
        }
      }
      break;

    case "/api/game/message":
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const responses = await gameManager.handlePlayerMessage(
            body.gameId,
            body.message,
          );
          return new Response(JSON.stringify({ responses }), {
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 400,
              headers: { "content-type": "application/json" },
            },
          );
        }
      }
      break;

    default:
      return new Response("Not Found", { status: 404 });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function getIndexHTML(): Promise<string> {
  try {
    return await Deno.readTextFile("./static/index.html");
  } catch {
    // Return a basic HTML template if file doesn't exist
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>LLM Roleplay Chat</title>
</head>
<body>
   <h1>Oops! Something went wrong.</h1>
</body>
</html>
    `;
  }
}

const port = parseInt(Deno.env.get("PORT") || "8000");
console.log(`🎭 LLM Chat server starting on http://localhost:${port}`);

Deno.serve({ port }, handler);
```

In the `main.ts` file we set up an HTTP server and a WebSocket server to handle
real-time communication. We use the HTTP server to serve static files and
provide API endpoints, while the WebSocket server manages real-time interactions
between clients.

## Add a frontend

The frontend of our app will live in the `static` directory. Create an
`index.html`, `app.js` and a `style.css` file in the `static` directory.

### `index.html`

We'll create a very basic layout with a textarea to collect the user's scenario
input and a section to show the response messages with a text input to send
messages. Copy the content from
[this html file](https://github.com/denoland/tutorial-with-llm/blob/main/static/index.html)
into your `index.html`.

### `app.js`

In `app.js`, we'll add the JavaScript to handle user input and display
responses. Copy the content from
[this js file](https://github.com/denoland/tutorial-with-llm/blob/main/static/app.js)
into your `app.js`.

### `style.css`

We'll add some basic styles to make our app look nicer. Copy the content from
[this css file](https://github.com/denoland/tutorial-with-llm/blob/main/static/style.css)
into your `style.css`.

## Run your application

Start your development server:

```bash
deno task dev
```

Your LLM chat application will be available at `http://localhost:8000`. The
application will:

1. **Auto-detect your LLM provider** based on available API keys
2. **Fall back to mock responses** if no API keys are configured
3. **Handle rate limiting** gracefully with retries and fallbacks
4. **Provide real-time interaction** through WebSockets

## Deploy your application to the cloud

Now that you have your working LLM chat application, you can deploy it to the
cloud with Deno Deploy.

For the best experience, you can deploy your app directly from GitHub, which
will set up automated deployments. Create a GitHub repository and push your app
there.

[Create a new GitHub repository](https://github.com/new), then initialize and
push your app to GitHub:

```sh
git init -b main
git remote add origin https://github.com/<your_github_username>/<your_repo_name>.git
git add .
git commit -am 'initial commit'
git push -u origin main
```

Once your app is on GitHub, you can
[deploy it to Deno Deploy](https://console.deno.com/).

Don't forget to add your `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` environment
variables in the project "Settings".

For a walkthrough of deploying your app, check out the
[Deno Deploy tutorial](/examples/deno_deploy_tutorial/).

## Testing

We've provided tests to verify your setup, copy the
[`main.test.ts`](https://github.com/denoland/tutorial-with-llm/blob/main/tests/main.test.ts)
file to your project directory and run the included tests to verify your setup:

```bash
deno task test
```

🦕 You now have a working LLM chat application, with realtime interaction, rate
limiting and error handling. Next you can customise it to your own play style!
Consider giving the LLM instructions on how to behave in different scenarios, or
how to respond to specific user inputs. You can add these into the character
configuration files.

You could also consider adding a database to store the conversation history for
long-term character and story development.

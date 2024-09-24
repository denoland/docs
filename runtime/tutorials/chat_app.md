---
title: "Chat application with WebSocket"
oldUrl:
  - /runtime/manual/examples/chat_app/
---

WebSockets are a powerful tool for building real-time applications. They allow
for bidirectional communication between the client and server without the need
for constant polling. A frequent use case for web sockets is chat applications.

In this tutorial we'll create a simple chat app using Deno and the built in
[WebSockets API](/api/web/websockets). The chat app will allow multiple chat
clients to connect to the same backend and send group messages. After a client
enters a username, they can then start sending messages to other online
clients. Each client also displays the list of currently active users.

![Chat app UI](./images/websockets.gif)

## Initialize a new project

First, create a new directory for your project and navigate into it.

```sh
deno init chat-app
cd deno-chat-app
```

## Building the Backend

We'll start by building the backend server that will handle the WebSocket
connections and broadcast messages to all connected clients. We'll use the
[`oak`](https://jsr.io/@oak/oak) middleware framework to set up our server,
clients can connect to the server, send messages and receive updates about other
connected users. Additionally the server will serve the static HTML, CSS and
JavaScript files that make up the chat client.

In your `main.ts` file, add the following code:

```ts title="main.ts"
import { Application, Router } from "@oak/oak";

const connectedClients = new Map();

const app = new Application();
const port = 8080;
const router = new Router();

router.get("/start_web_socket", async (ctx) => {});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/`,
    index: "public/index.html",
  });
});

console.log("Listening at http://localhost:" + port);
await app.listen({ port });
```

This will set up a basic server that listens on port 8080 and serves the
`index.html` file from the `public` directory. Now we'll set up the logic for
handling the WebSockets connections. Inside the body of the
`router.get("/start_web_socket", async (ctx) => {})` function add the following
code:

```ts title="main.ts"
const socket = await ctx.upgrade();
const username = ctx.request.url.searchParams.get("username");

if (connectedClients.has(username)) {
  socket.close(1008, `Username ${username} is already taken`);
  return;
}

socket.username = username;
connectedClients.set(username, socket);
console.log(`New client connected: ${username}`);

// broadcast the active users list when a new user logs in
socket.onopen = () => {
  broadcast_usernames();
};

// when a client disconnects, remove them from the connected clients list
// and rebroadcast the active users list
socket.onclose = () => {
  console.log(`Client ${socket.username} disconnected`);
  connectedClients.delete(socket.username);
  broadcast_usernames();
};

// broadcast new message if someone sent one
socket.onmessage = (m) => {
  const data = JSON.parse(m.data);
  switch (data.event) {
    case "send-message":
      broadcast(
        JSON.stringify({
          event: "send-message",
          username: socket.username,
          message: data.message,
        }),
      );
      break;
  }
};
```

This code sets up the WebSocket connection and adds the client username to the
list of connected clients, disallowing multiple users with the same name. It
also listens for new messages from the client and broadcasts them to all
connected clients.

Finally, we'll define the `broadcast` and `broadcast_usernames` utility
functions. Add the following code to the bottom of your `main.ts`, before the
`app.use` statements:

```ts title="main.ts"
// send a message to all connected clients
function broadcast(message) {
  for (const client of connectedClients.values()) {
    client.send(message);
  }
}

// send updated users list to all connected clients
function broadcast_usernames() {
  const usernames = [...connectedClients.keys()];
  console.log(
    "Sending updated username list to all clients: " +
      JSON.stringify(usernames),
  );
  broadcast(
    JSON.stringify({
      event: "update-users",
      usernames: usernames,
    }),
  );
}
```

The `broadcast` function sends a message to all connected clients and the
`broadcast_usernames` function sends the list of currently connected users to
all clients.

## Building the Frontend

We'll build a simple UI that shows a text input and a send button and displays
the sent messages, alongside a list of users in the chat.

### HTML

In your new project directory, create a `public` folder and add an `index.html`
file and add the following code:

```html
<html>
    <head>
        <title>Deno Chat App</title>
        <link rel="stylesheet" href="/public/style.css">
        <script src="/public/app.js"></script>
    </head>
    <body>
        <header>
            <h1>🦕 Deno Chat App</h1>
        </header>
        <aside>
            <h2>Users online</h2>
            <ul id="users"></ul>
        </aside>
        <main>
            <div id="conversation"></div>
            <form>
                <textarea id="data" placeholder="send message"></textarea>
                <button type="submit" id="send">Send ᯓ✉︎</button>
            </form>
        </main>
    </body>
</html>
```

### CSS

If you'd like to style your chat app, create a `style.css` file in the `public`
folder and add the following code:

TODO: link to css

### JavaScript

We'll set up the client side JavaScript in an `app.js` file, you'll have seen it
linked in the HTML we just wrote. In the `public` folder and add an `app.js`
file with the following code:

```js
// Initialize WebSocket connection
const myUsername = prompt("Please enter your name") || "Anonymous";
const socket = new WebSocket(
  `ws://localhost:8080/start_web_socket?username=${myUsername}`,
);

// Handle WebSocket messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.event) {
    case "update-users":
      updateUserList(data.usernames);
      break;

    case "send-message":
      addMessage(data.username, data.message);
      break;
  }
};

// Update user list in the DOM
function updateUserList(usernames) {
  const userList = document.getElementById("users");
  userList.innerHTML = ""; // Clear existing list

  for (const username of usernames) {
    const listItem = document.createElement("li");
    listItem.textContent = username;
    userList.appendChild(listItem);
  }
}

// Add a new message to the conversation
function addMessage(username, message) {
  const conversation = document.getElementById("conversation");
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<span>${username}</span> ${message}`;
  conversation.prepend(messageDiv);
}

// Set up event listener for sending messages
window.onload = () => {
  const inputElement = document.getElementById("data");
  const sendButton = document.getElementById("send");

  // Listen for Enter key press
  inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const message = inputElement.value;
      inputElement.value = "";
      socket.send(JSON.stringify({ event: "send-message", message }));
    }
  });

  // Listen for button click
  sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    const message = inputElement.value;
    inputElement.value = "";
    socket.send(JSON.stringify({ event: "send-message", message }));
  });
};
```

This code sets up a WebSocket connection to the server and listens for messages
from the server. When a new message is received, if it is a `send-message` event
it updates the DOM with the new message, and if it is an `update-users` event it
updates the list of active users. It also sets up event listeners for either
pressing the Enter key or clicking the send button to send a message to the
server.

## Running the server

To run the server we'll need to grant the necessary permissions to Deno. In your
`deno.json` file, update the `dev` task to allow read and network access:

```sh title="deno.json"
"dev": "deno run --allow-net --allow-read --watch main.ts"
```

Now if you visit [http://localhost:8080](http://localhost:8080/) you will be
able to start a chat session. You can open 2 simultaneous tabs and try chatting
with yourself.

![Chat app UI](./images/websockets.gif)

TODO: link to repo

🦕 Now you can use WebSockets with Deno you're ready to build all kinds of
realtime applications! WebSockets can be used to build realtime dashboards,
games and collaborative editing tools and much more! If you're looking for ways
to expand upon your chat app, perhaps you could consider adding data to the
messages to allow you to style messages differently if they're sent from you or
someone else. Whatever you're building, Deno will WebSocket to ya!

---
title: "How to use Express with Deno"
url: /examples/express_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/express/
  - /runtime/manual/node/how_to_with_npm/express/
  - /runtime/tutorials/how_to_with_npm/express/
---

[Express](https://expressjs.com/) is a popular web framework known for being
simple and unopinionated with a large ecosystem of middleware.

This How To guide will show you how to create a simple API using Express and
Deno.

[View source here.](https://github.com/denoland/tutorial-with-express)

## Initialize a new deno project

In your commandline run the command to create a new starter project, then
navigate into the project directory:

```sh
deno init my-express-project
cd my-express-project
```

## Install Express

To install Express, we'll use the `npm:` module specifier. This specifier allows
us to import modules from npm:

```sh
deno add npm:express
```

This will add the latest `express` package to the `imports` field in your
`deno.json` file. Now you can import `express` in your code with
`import express from "express";`.

## Update `main.ts`

In the `main.ts`, let's create a simple server:

```ts
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.listen(8000);
console.log(`Server is running on http://localhost:8000`);
```

You may notice that your editor is complaining about the `req` and `res`
parameters. This is because Deno does not have types for the `express` module.
To fix this, you can import the Express types file directly from npm. Add the
following comment to the top of your `main.ts` file:

```ts
// @ts-types="npm:@types/express@4.17.15"
```

This comment tells Deno to use the types from the `@types/express` package.

## Run the server

When you initialized the project, Deno set up a task which will run the main.ts
file, you can see it in the `deno.json` file. Update the `dev` task to include
the [`--allow-net`](/runtime/fundamentals/security/#network-access) flag:

````jsonc
{
  "scripts": {
    "dev": "deno run --allow-net main.ts"
  }, 
  ...
}

This will allow the project to make network requests. You can [read more about permissions flags](/runtime/fundamentals/security/).

Now you can run the server with:

```sh
deno run dev
````

If you visit `localhost:8000` in your browser, you should see:

**Welcome to the Dinosaur API!**

## Add data and routes

The next step here is to add some data. We'll use this Dinosaur data that we
found from [this article](https://www.thoughtco.com/dinosaurs-a-to-z-1093748).
Feel free to
[copy it from here](https://raw.githubusercontent.com/denoland/tutorial-with-express/refs/heads/main/data.json).

Create a `data.json` file in the root of your project, and paste in the dinosaur
data.

Next, we'll import that data into `main.ts`:

```ts
import data from "./data.json" with { type: "json" };
```

We will create the routes to access that data.

To keep it simple, let's just define `GET` handlers for `/api/` and
`/api/:dinosaur`. Add the following code after the `const app = express();`
line:

```ts
app.get("/", (req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.get("/api", (req, res) => {
  res.send(data);
});

app.get("/api/:dinosaur", (req, res) => {
  if (req?.params?.dinosaur) {
    const found = data.find((item) =>
      item.name.toLowerCase() === req.params.dinosaur.toLowerCase()
    );
    if (found) {
      res.send(found);
    } else {
      res.send("No dinosaurs found.");
    }
  }
});

app.listen(8000);
console.log(`Server is running on http://localhost:8000`);
```

Let's run the server with `deno run dev` and check out `localhost:8000/api` in
your browser. You should see a list of dinosaurs!

```jsonc
[
  {
    "name": "Aardonyx",
    "description": "An early stage in the evolution of sauropods."
  },
  {
    "name": "Abelisaurus",
    "description": "\"Abel's lizard\" has been reconstructed from a single skull."
  },
  {
    "name": "Abrictosaurus",
    "description": "An early relative of Heterodontosaurus."
  },
...
```

You can also get the details of a specific dinosaur by visiting "/api/dinosaur
name", for example `localhost:8000/api/aardonyx` will display:

```json
{
  "name": "Aardonyx",
  "description": "An early stage in the evolution of sauropods."
}
```

🦕 Now you're all set to use Express with Deno. You could consider expanding
this example into a dinosaur web app. Or take a look at
[Deno's built in HTTP server](https://docs.deno.com/runtime/fundamentals/http_server/).

# How to use Express with Deno

[Express](https://expressjs.com/) is a popular web framework known for being
simple and unopinionated with a large ecosystem of middleware.

This How To guide will show you how to create a simple API using Express and
Deno.

[View source here.](https://github.com/denoland/examples/tree/main/with-express)

## Create `main.ts`

Let's create `main.ts`:

```
touch main.ts
```

In `main.ts`, let's create a simple server:

```ts, ignore
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.listen(8000);
```

Let's run this server:

```
deno run -A main.ts
```

And point our browser to `localhost:8000`. You should see:

```
Welcome to the Dinosaur API!
```

## Add data and routes

The next step here is to add some data. We'll use this Dinosaur data that we
found from [this article](https://www.thoughtco.com/dinosaurs-a-to-z-1093748).
Feel free to
[copy it from here](https://github.com/denoland/examples/blob/main/with-express/data.json).

Let's create `data.json`:

```
touch data.json
```

And paste in the dinosaur data.

Next, let's import that data into `main.ts`. Let's add this line at the top of
the file:

```ts, ignore
import data from "./data.json" assert { type: "json" };
```

Then, we can create the routes to access that data. To keep it simple, let's
just define `GET` handlers for `/api/` and `/api/:dinosaur`. Add the below after
the `const app = express();` line:

```ts, ignore
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
```

Let's run the server with `deno run -A main.ts` and check out
`localhost:8000/api`. You should see a list of dinosaurs:

```json, ignore
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

And when we go to `localhost:8000/api/aardonyx`:

```json, ignore
{
  "name": "Aardonyx",
  "description": "An early stage in the evolution of sauropods."
}
```

Great!

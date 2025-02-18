---
title: "Deploying Deno with Docker"
url: /examples/deploying_deno_with_docker/
videoUrl: https://www.youtube.com/watch?v=VRryNeYm6yw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=16
layout: video.tsx
---

## Description of video

See how to deploy Deno applications with Docker to a compatible cloud
environment.

## Resources

- https://github.com/denoland/deno_docker
- https://fly.io/

## Transcript and code

Deno has made a lot of things seem easy: linting, formatting, interoperability
with the Node ecosystem, testing, TypeScript, but how about deployment? How easy
is it to get Deno running in production? Pretty easy!

Let’s start with a look at our app. It’s an app that provides us with some
information about trees. On the homepage we get some text At the trees route, we
get some JSON At the dynamic route based on the tree’s id, we get information
about that single tree.

```ts
import { Hono } from "jsr:@hono/hono";

const app = new Hono();

interface Tree {
  id: string;
  species: string;
  age: number;
  location: string;
}

const oak: Tree = {
  id: "1",
  species: "oak",
  age: 3,
  location: "Jim's Park",
};

const maple: Tree = {
  id: "2",
  species: "maple",
  age: 5,
  location: "Betty's Garden",
};

const trees: Tree[] = [oak, maple];

app.get("/", (c) => {
  return c.text("🌲 🌳 The Trees Welcome You! 🌲 🌳");
});

app.get("/trees", (c) => {
  return c.json(trees);
});

app.get("/trees/:id", (c) => {
  const id = c.req.param("id");
  const tree = trees.find((tree) => tree.id === id);
  if (!tree) return c.json({ message: "That tree isn't here!" }, 404);
  return c.json(tree);
});

Deno.serve(app.fetch);
```

## Run Locally with Docker

Make sure that Docker is installed on your machine. In your terminal or command
prompt, you can run docker and if you get a big list of commands, you have it.
If not, head over to https://www.docker.com/ and download it based on your
operating system.

### Test run docker:

```shell
docker
```

Then run the command to get running on `localhost:8000` with Docker

```shell
docker run -it -p 8000:8000 -v $PWD:/my-deno-project denoland/deno:2.0.2 run
--allow-net /my-deno-project/main.ts
```

Visit the app running at `localhost:8000`

It’s also possible to run this with a docker config file.

```dockerfile
FROM
denoland/deno:2.0.2

# The port that your application listens to.

EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY . .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

# Warmup caches
RUN timeout 10s deno -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["run", "--allow-net", "main.ts"]
```

Then build it

```shell
docker build -t my-deno-project .
```

From there, you can deploy the app to your hosting provider of choice. I’m going
to use fly.io today.

## Deploy to fly.io

If you haven’t worked with fly before, it’s a cloud platform that allows you to
deploy and run fullstack apps. They run in multiple regions throughout the world
which makes them a pretty nice option. https://fly.io/

### Install Fly

Install with curl

```shell
curl -L https://fly.io/install.sh | sh
```

### Log in with Fly via CLI

```shell
fly auth login
```

This will open the browser for you to log into your account (or create one if
you haven’t already). Then we’ll launch the app with fly using:

```shell
flyctl launch
```

This will generate a fly.toml file for the app, and you can choose different
settings if you’d like to. And more importantly it will launch it! We’ll just
wait for the process to complete, and we should be able to view our app running
at that location.

So with Deno, we can use Docker to containerize the app and with Fly we can get
the app hosted in production in just a few minutes.

---
title: "Deploy Classic"
oldUrl:
  - /deploy/docs/
  - /deploy/manual/hello-world/
---

:::info Legacy Documentation

You are viewing legacy documentation for Deno Deploy Classic. We recommend
migrating to the new <a href="/deploy/">Deno Deploy</a> platform.

:::

This section documents the legacy Deno Deploy Classic platform (dash.deno.com).
We are no longer onboarding new users or organizations to Deploy Classic.

If you already have existing Deploy Classic projects, you may continue to
operate them for now, but we strongly encourage you to begin migrating to the
new Deno Deploy platform at [console.deno.com](https://console.deno.com).

Key differences:

- Deploy Classic is in maintenance mode (no new features, limited updates).
- New capabilities (enhanced Node/NPM support, integrated builds, metrics,
  tracing, framework presets, static assets, improved infra) are available in
  Deno Deploy.

Get started with the new platform here:
[About Deno Deploy Early Access](/deploy/).

Migration guidance is coming soon. In the meantime, you can set up a new Deno
Deploy org and redeploy your apps there. Reach out to
<a href="mailto:support@deno.com">support</a> if you need assistance.

## What is Deno Deploy Classic?

Deno Deploy Classic is a globally distributed platform for serverless JavaScript
applications. Your JavaScript, TypeScript, and WebAssembly code runs on managed
servers geographically close to your users, enabling low latency and faster
response times. Deploy Classic applications run on fast, light-weight
[V8 isolates](https://deno.com/blog/anatomy-isolate-cloud) rather than virtual
machines, powered by the [Deno runtime](/runtime/manual).

Let's deploy your first application - it should only take a few minutes.

## Install Deno and `deployctl`

If you haven't already, you can
[install the Deno runtime](/runtime/getting_started/installation) using one of
the commands below:

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

After Deno is installed, install the [`deployctl`](./deployctl.md) utility:

```sh
deno install -A jsr:@deno/deployctl --global
```

You can confirm `deployctl` has been installed correctly by running:

```console
deployctl --help
```

Now, you're ready to deploy a Deno script from the command line!

## Write and test a Deno program

First, create a directory for the project and create a file called `main.ts` in
it, with the following "Hello World" web server:

```ts title="main.ts"
Deno.serve(() => new Response("Hello, world!"));
```

You can test that it works by running it with the command below:

```sh
deno run --allow-net main.ts
```

Your server should be viewable at [localhost:8000](http://localhost:8000). Now
let's run this code on the edge with Deno Deploy!

## Deploy your project

From the directory of the `main.ts` file you just created, run this command:

```sh
deployctl deploy
```

You will be asked to authorize Deno Deploy in GitHub to sign up to Deno Deploy
and/or to provision an access token for `deployctl`. A few moments after that,
your Hello World server will be deployed in Deno Deploy Classic infrastructure
all around the world, ready to handle all the traffic you expect.

## Next Steps

Now that you've created your first deployment, you can
[learn what kinds of apps](./use-cases.md) you can run on Deno Deploy, check out
[what else you can do with deployctl](./deployctl.md), or keep reading to find
out what other options you have to deploy your code to Deno Deploy. We're so
excited to see what you'll ship with Deno Deploy!

### Deploy your existing project

Import a project and run it on the edge with Deno Deploy.

1. [From the Deno Deploy Classic dashboard](https://dash.deno.com) click the
   "New Project" button.

2. Connect to your GitHub account and select the repository you would like to
   deploy.

3. Follow the on-screen instructions to deploy your existing application.

   If your project requires a build step, use the Project Configuration form to
   create a GitHub action to deploy your project. Give your project a name and
   select from the optional framework presets. If you are not using a framework,
   you can set up your build settings using the form.

4. Confirm that your build options are correct and click the "Deploy Project"
   button to kick off your new Github action and deploy your project.

In a few moments, your project will be deployed across ~12 data centers around
the world, ready to handle large volumes of traffic.

Once your deployment is successful you can visit your newly deployed project at
the url provided on the success page or manage it in your dashboard.

### Start with a playground

A [playground](./playgrounds.md) is a browser-based editor that enables you to
write and run JavaScript or TypeScript code right away This is a great choice
for just kicking the tires on Deno and Deno Deploy!

From the [Deno Deploy Classic dashboard](https://dash.deno.com), click the "New
Playground" button to create a playground. We also have a variety of ready built
tutorials for you to try out Deno Deploy Classic try them out by clicking on
"Learning Playground" or visiting:\
[Simple HTTP server playground](https://dash.deno.com/tutorial/tutorial-http)\
[Using the Deno KV database playground](https://dash.deno.com/tutorial/tutorial-http-kv)\
[RESTful API server playground](https://dash.deno.com/tutorial/tutorial-restful)\
[Realtime app with WebSockets playground](https://dash.deno.com/tutorial/tutorial-websocket)\
[Recurring tasks with Deno.cron playground](https://dash.deno.com/tutorial/tutorial-cron)

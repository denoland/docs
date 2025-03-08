---
title: "Your Deno Dev Environment"
url: /examples/deno_dev_environment/
videoUrl: https://www.youtube.com/watch?v=BFfrGrLm2tw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=3
layout: video.tsx
---

## Video description

How to set up your development environment for Deno

## Transcript and code

To install Deno, we'll run curl. So we're going to grab this curl command
[from the documentation](https://docs.deno.com/runtime/getting_started/installation/).

```shell
curl -fsSL https://deno.land/install.sh | sh
```

We'll go to our terminal, we'll paste that in, hit enter, and this will install
Deno in the background to the most recent version. When I do this, it'll ask me
if I want to add Deno to the path. We'll go ahead and say yes, and you can add
these setup completions here.

And now we have installed this to our path. If you're on Windows, there are
installation instructions for you here in the documentation.

To generate a Deno project from scratch, let's go ahead and type
`deno init MyDenoProject`. This is going to create that folder for me. I can
then cd into that folder. Now if we open this up in VSCode, this has created a
`deno.json` file, a `main_test.ts` file, and a `main.ts` file. So this is a
quick way of getting started.

If you're using VSCode, there are a few configuration options that you'll want
to set up. So we'll go up here to code and settings. We'll select extensions. So
over here in your extensions, you're going to search for Deno, and then we'll
[select the one that has been created by Denoland here](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno).

```javascript
{
  "deno.enable": true,
}
```

We're going to run install, and this will install our Deno land extension. Next
we'll type `command shift P`. This will open up our command palette here, and we
can type `deno initialize workspace configuration`. We're going to go ahead and
click that. That's going to generate this VSCode folder with settings. This is
going to enable hints and autocomplete and all of that right here in the code
editor. So if I start to type anything from `deno serve`, for example, that's
going to give me a look at what the expected parameters of that function are.
That's very helpful.

This is also going to give us hints when importing. So we'll say import star as
path from JSR at standard slash path.

```javascript
import * as path from "jsr:@std/path";
```

So all of them are listed there. Pretty cool. And then if we wanted to do
something for a remote module, something like OpenAI from
[https://deno.land/x/openai@v4.67.1/mod.ts](https://deno.land/x/openai@v4.67.1/mod.ts)
(or now, even better, from [JSR](https://jsr.io/@openai/openai))

```javascript
import OpenAI from "jsr:@openai/openai";
```

This is then going to give us the standard library as well as X for all of those
third party APIs. So you can actually drill down into OpenAI from here. You just
need to select the version, so we'll say OpenAI at v461. And then you can even
drill down into that individual file.

If you take a look at
[the documentation
here, this will guide you through the process of setting up your own unique
environment](/runtime/getting_started/setup_your_environment/). There are
[shell completions](/runtime/getting_started/setup_your_environment/#shell-completions)
that you can add, so depending on which CLI tool you're using, you can set this
up over here, whether it's Bash or PowerShell or ZShell or whatever it might be.

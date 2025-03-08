---
title: "Browser APIs in Deno"
url: /examples/browser_apis_in_deno/
videoUrl: https://www.youtube.com/watch?v=oxVwTT-rZRo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=6
layout: video.tsx
---

## Video description

Deno wants to give developers the most browser-like programming environment
possible. Deno uses web standard APIs, so if you're familiar with building for
the web, then you're familiar with Deno. If not, when you learn how to use deno,
you're also learning how to build for the web.

 If you take a look at the docs, it gives you a good sense of what's available,
so we got things like Canvas and internationalization and messaging and storage
and streams, temporal, WebSockets, all of those things that we like to use on
the web, we're going to find them built in to Deno.

## Transcript and code

Let's take a look at `fetch` first. This works like you might think.

 We're going to take a response. from fetching the JSON placeholder API. Then
we're going to take that response and convert it to JSON as a new variable and
console.log it. Now, if we take a look at this in the terminal, we'll say deno
allow network, so that we can opt into this running that fetch immediately.

```javascript title="main.ts"
const response = await fetch("https://snowtooth-hotel-api.fly.dev");
const data = await response.json();
console.log(data);
```

And we're done here. All the data comes back like we would expect.

```shell
deno add jsr:@std/streams
```

 So let me show you what I mean by this. We're going to keep that fetch. We're
going to say if that response body value exists, we're going to create a new
variable called transformed stream, and we'll set that equal to response dot
body. Thank you. And here we're going to use the function called pipe through.

And Pipe through is this method in JavaScript that's going to allow us to take
the output of the readable stream and pass it through to modify the stream's
data. The first thing we're going to do is decode the byte stream into a text
stream. So we'll say new text, decoder stream. Then we'll chain on another one
of these functions pipeThrough.

So this time we're going to split the text stream into lines. So we'll have
different lines coming back from our data. Now the text line stream is actually
coming from a library that we need to include.

```javascript
import { TextLineStream } from "@std/streams";
import { toTransformStream } from "@std/streams/to-transform-stream";

const response = await fetch("https://example.com/data.txt");

// Ensure the response body exists
if (response.body) {
  // Create a stream reader that processes the response body line by line
  const transformedStream = response.body
    // Decode the byte stream into a text stream
    .pipeThrough(new TextDecoderStream())
    // Split the text stream into lines
    .pipeThrough(new TextLineStream())
    // Get a reader to read the lines
    //.getReader();
    .pipeThrough(toTransformStream(async function* (src) {
      for await (const chunk of src) {
        if (chunk.trim().length === 0) {
          continue;
        }
        console.log(chunk);
        yield chunk;
      }
    }));
  // Create a reader to consume the transformed stream
  const reader = transformedStream.getReader();
  // Read and log each line of text from the stream
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log(value); // Log each parsed JSON object
  }
}
```

## Setting Up Configuration

So we're going to say `deno add jsr@std/streams`. That will create our
`deno.json` configuration file over here. There will be another video to dig
into this in a little more depth, but just know for now that this is including
any imports that are part of our project. So the transform stream is coming
together, but there's a few more steps.

## Using the Transform Stream

The next step is we use pipeThrough again. Now this time we're going to use
another function to transform stream, and this is going to come from standard
streams and specifically the function `toTransformStream`. Now this time we're
going to pass in here an asynchronous generator. We know that it's a generator
because we use that asterisk there and the body of this function is a loop, and
here we're going to say const chunk, so the little blob of data that we're
dealing with, chunk of source, which is the value that's passed in there.

We're going to say `console.log(chunk)`, and we're also going to yield the chunk
here. Okay, so what is this `console.log` doing for us? Let's go ahead and run
`deno --allow-net main.ts`. This is showing us that this is the top line of our
HTML document.

So we actually need a way to iterate through this, and we're going to do this by
creating a reader to consume this transformed stream. So let's get rid of our
console log here. Here we're going to create a value called reader that's going
to be set equal to `transformedStream.getReader()`. Now from here, what we can
do is create a little while loop here. So while that value is true.

We want to destructure `{value, done}` from `await reader.read()`. So again, we
can call the `.read()` method on that reader. Then we're going to say if `done`
is true, then we want to break out of the loop. Otherwise, we want to
`console.log(value)`.

Nice. So now we're going to see our HTML here printed line by line in our
console.

 All right, so that is a quick example of using our text line stream. We can use
it in combination with fetch. And if you want to learn more about this API, you
can check out the documentation here. Deno offers us a truly browser-like
environment for using things like fetch, Web Workers, and much, much more.

Deno has made it really smooth to use these web-standard APIs in a way that
feels familiar and friendly.

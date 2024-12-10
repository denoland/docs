---
title: "Fetch and stream data"
url: /examples/fetch_data_tutorial/
oldUrl:
  - /runtime/manual/examples/fetch_data/
  - /runtime/tutorials/fetch_data/
---

Deno brings several familiar Web APIs to the server-side environment. If you've
worked with browsers you may recognize the [`fetch()`](/api/web/fetch) method
and the [`streams`](/api/web/streams) API, which are used to make network
requests and access streams of data over the network. Deno implements these
APIs, allowing you to fetch and stream data from the web.

## Fetching data

When building a web application, developers will often need to retrieve
resources from somewhere else on the web. We can do so with the `fetch` API.
We'll look at how to fetch different shapes of data from a url and how to handle
an error if the request fails.

Create a new file called `fetch.js` and add the following code:

```ts title="fetch.js"
// Output: JSON Data
const jsonResponse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResponse.json();

console.log(jsonData, "\n");

// Output: HTML Data
const textResponse = await fetch("https://deno.land/");
const textData = await textResponse.text();

console.log(textData, "\n");

// Output: Error Message
try {
  await fetch("https://does.not.exist/");
} catch (error) {
  console.log(error);
}
```

You can run this code with the `deno run` command. Because it is fetching data
across the network, you need to grant the `--allow-net` permission:

```sh
deno run --allow-net fetch.js
```

You should see the JSON data, HTML data as text, and an error message in the
console.

## Streaming data

Sometimes you may want to send or receive large files over the network. When you
don't know the size of a file in advance, streaming is a more efficient way to
handle the data. The client can read from the stream until it says it is done.

Deno provides a way to stream data using the `Streams API`. We'll look at how to
convert a file into a readable or writable stream and how to send and receive
files using streams.

Create a new file called `stream.js`.

We'll use the `fetch` API to retrieve a file. Then we'll use the
[`Deno.open`](/api/deno/Deno.open) method to create and open a writable file and
the [`pipeTo`](/api/web/~/ReadableStream.pipeTo) method from the Streams API to
send the byte stream to the created file.

Next, we'll use the `readable` property on a `POST` request to send the bite
stream of the file to a server.

```ts title="stream.js"
// Receiving a file
const fileResponse = await fetch("https://deno.land/logo.svg");

if (fileResponse.body) {
  const file = await Deno.open("./logo.svg", { write: true, create: true });

  await fileResponse.body.pipeTo(file.writable);
}

// Sending a file
const file = await Deno.open("./logo.svg", { read: true });

await fetch("https://example.com/", {
  method: "POST",
  body: file.readable,
});
```

You can run this code with the `deno run` command. Because it is fetching data
across the network and writing to a file, you need to grant the `--allow-net`,
`--allow-write` and `--allow-read` permissions:

```sh
deno run --allow-read --allow-write --allow-net stream.js
```

You should see the file `logo.svg` created and populated in the current
directory and, if you owned example.com you would see the file being sent to the
server.

🦕 Now you know how to fetch and stream data across a network and how to stream
that data to and from files! Whether you're serving static files, processing
uploads, generating dynamic content or streaming large datasets, Deno’s file
handling and streaming capabilities are great tools to have in your developer
toolbox!

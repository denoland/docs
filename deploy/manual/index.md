---
displayed_sidebar: deployGuideHome
sidebar_position: 1
sidebar_label: Overview
pagination_next: manual/how-to-deploy
---

# About Deno Deploy

Deno Deploy is a distributed system that allows you to run JavaScript,
TypeScript, and WebAssembly close to users, at the edge, worldwide. Deeply
integrated with the V8 runtime, our servers provide minimal latency and
eliminate unnecessary abstractions. You can develop your script locally using
the Deno CLI, and then deploy it to our managed infrastructure in less than a
second, without the need to configure anything.

Built on the same modern systems as the Deno CLI, Deno Deploy provides the
latest and greatest in web technologies in a globally scalable way:

- **Builds on the Web**: use `fetch`, `WebSocket`, or `URL` just like in the
  browser
- **Built-in support for TypeScript and JSX**: type safe code, and intuitive
  server side rendering without a build step
- **Web compatible ES modules**: import dependencies just like in a browser,
  without the need for explicit installation
- **Direct GitHub integration**: push to a branch, review a deployed preview,
  and merge to release to production
- **Extremely fast**: deploy in less than a second, serve globally close to
  users

## Use cases

Some popular use-cases for Deno currently are:

- [Middleware](#middleware)
- [API servers](#api-servers)
- [Full websites](#full-websites)

## Middleware

Middleware refers to bits of code that execute before and after the request gets
to the application server. You'll be writing middleware if you want to execute
some JavaScript or any other code very fast, early in the request. By deploying
your middleware code at the edge, Deno Deploy ensures the best performance for
your app.

Some examples include:

- setting a cookie
- serving different versions of a site depending on geolocation
- path rewriting
- redirecting requests
- dynamically changing the HTML on its way back from the server before it gets
  to the user.

Deno Deploy is a good alternative to other platforms you might be using to host
your middleware right now, for example:

- Cloudflare Workers
- AWS Lambda@Edge
- Traditional load balancers like nginx
- Custom rules

## API servers

Deno is also a great fit for API servers. By deploying these servers "at the
edge", closer to clients who are using them, Deno Deploy is able to offer lower
latency, improved performance, and reduced bandwidth costs compared to
traditional hosting platforms like Heroku or even modern centralized hosting
services like DigitalOcean.

## Full websites

We foresee a future where you can actually write your entire website on edge
functions. Some examples of sites that are already doing this include:

- [blog](https://github.com/ry/tinyclouds)
- [chat](https://github.com/denoland/showcase_chat)
- [calendly clone](https://github.com/denoland/meet-me)

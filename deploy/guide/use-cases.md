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

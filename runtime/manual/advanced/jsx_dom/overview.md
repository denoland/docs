# Overview of JSX and DOM in Deno

One of the common use cases for Deno is to handle workloads as part of web
applications. Because Deno includes many of the browser APIs built-in, there is
a lot of power in being able to create isomorphic code that can run both in Deno
and in the browser. A powerful workload that can be handled by Deno is
performing _server side rendering_ (SSR), where application state is used
_server side_ to dynamically render HTML and CSS to be provided to a client.

Server side rendering, when used effectively, can dramatically increase the
performance of a web application by offloading heavy calculations of dynamic
content to a server process allowing an application developer to minimize the
JavaScript and application state that needs to be shipped to the browser.

A web application is generally made up of three key technologies:

- JavaScript
- HTML
- CSS

As well as increasingly, [WebAssembly](../../runtime/webassembly/index.md) might
play a part in a web application.

These technologies combine to allow a developer to build an application in a
browser using the web platform. While Deno supports a lot of web platform APIs,
it generally only supports web APIs that are usable in a _server-side_ context,
but in a client/browser context, the main "display" API is the Document Object
Model (or DOM). There are APIs that are accessible to application logic via
JavaScript that manipulate the DOM to provide a desired outcome, as well as HTML
and CSS are used to structure and style the _display_ of a web application.

In order to facilitate manipulation of the DOM server side and the ability to
generate HTML and CSS dynamically, there are some key technologies and libraries
that can be used with Deno to achieve this, which we will explore in this
chapter.

We will be exploring fairly low-level enabling libraries and technologies,
versus a full solution or framework for server side generation of websites.

## JSX

Created by the React team at Facebook, JSX is a popular DSL (domain specific
language) for embedding HTML-like syntax in JavaScript. The TypeScript team also
added support for the JSX syntax into TypeScript. JSX has become popular with
developers as it allows mixing imperative programming logic with a declarative
syntax that looks a lot like HTML.

An example of what a JSX "component" might look like:

```jsx
export function Greeting({ name }) {
  return (
    <div>
      <h1>Hello {name}!</h1>
    </div>
  );
}
```

The main challenge with JSX is that it isn't JavaScript nor is it HTML. It
requires transpiling to pure JavaScript before it can be used in a browser,
which then has to process that logic to manipulate the DOM in the browser. This
is probably less efficient than having a browser render static HTML.

This is where Deno can play a role. Deno supports JSX in both `.jsx` and `.tsx`
modules and combined with a JSX runtime, Deno can be used to dynamically
generate HTML to be sent to a browser client, without the need of shipping the
un-transpiled source file, or the JSX runtime library to the browser.

Read the [Configuring JSX in Deno](./jsx.md) section for information on how to
customize the configuration of JSX in Deno.

## Document Object Model (DOM)

The DOM is the main way a user interface is provided in a browser, and it
exposes a set of APIs that allow it to be manipulated via JavaScript, but also
allows the direct use of HTML and CSS.

While Deno has a lot of web platform APIs, it does not support most of the DOM
APIs related to visual representation. Having said that though, there are a few
libraries that provide a lot of the APIs needed to take code that was designed
to run in a web browser to be able to run under Deno, in order to generate HTML
and CSS which can be shipped to a browser "pre-rendered". We will cover those in
the following sections:

- [Using LinkeDOM with Deno](./linkedom.md)
- [Using deno-dom with Deno](./deno_dom.md)
- [Using jsdom with Deno](./jsdom.md)

## CSS

Cascading Style Sheets (CSS) provide styling for HTML within the DOM. There are
tools which make working with CSS in a server side context easier and powerful.

- [Parsing and stringifying CSS](./css.md)
- [Using Twind with Deno](./twind.md)

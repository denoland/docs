---
title: "Better debugging with the console API"
url: /examples/tutorials/debugging-with-console/
---

Some of the console API is probably muscle memory for web developers, but there
is so much more than just `console.log()` for you to use. Deno has great support
for this API, so whether you’re writing JavaScript for the browser of for the
server it’s worth learning about these helpful utilities.

Let’s take a look at some of this API’s most useful methods. Your debugging is
going to get so much easier!

## `console.log()`

Hello, old friend! You’ll most likely be using this to output logging messages
to the console to help you debug.

```js
console.log("Hello, world!"); // "Hello, world!"
```

You can output multiple items by separated by commas like so:

```jsx
const person = {"name": "Jane", "city": "New York"}
console.log("Hello, " person.name, "from ", person.city); // "Hello, Jane from New York"
```

Or you can use string literals:

```jsx
const person = { "name": "Jane", "city": "New York" };
console.log(`Hello ${person.name} from ${person.city}`); // "Hello, Jane from New York"
```

You can also [apply some styling using CSS](/examples/color_logging/) using the
`%c` directive:

```jsx
console.log("Wild %cblue", "color: blue", "yonder"); // Applies a blue text color to the word "blue"
```

…but there is much more you can do with the console API.

## `console.table()`

The `table` method is helpful for outputting structured data like objects for
easier inspection.

```jsx
const people = {
  "john": {
    "age": 30,
    "city": "New York",
  },
  "jane": {
    "age": 25,
    "city": "Los Angeles",
  },
};

console.table(people);

/*
┌───────┬─────┬───────────────┐
│ (idx) │ age │ city          │
├───────┼─────┼───────────────┤
│ john  │ 30  │ "New York"    │
│ jane  │ 25  │ "Los Angeles" │
└───────┴─────┴───────────────┘
*/
```

You can also specify the properties of your object that you’d like to include in
the table. Great for inspecting a summary of those detailed objects to see just
the part you are concerned with.

```jsx
console.table(people, ["city"]);

/* outputs
┌───────┬───────────────┐
│ (idx) │ city          │
├───────┼───────────────┤
│ john  │ "New York"    │
│ jane  │ "Los Angeles" │
└───────┴───────────────┘
*/
```

## Timer methods

Understanding how long specific parts of your application take is key to
removing performance bottlenecks and expensive operations. If you’ve ever
reached for JavaScript’s date method to make yourself a timer, you’ll wish you’d
know this one long ago. It’s more convenient and more accurate.

Try
using[`console.time()`](https://developer.mozilla.org/en-US/docs/Web/API/console/time_static),
[`console.timeLog()`](https://developer.mozilla.org/en-US/docs/Web/API/console/timeLog_static),
and
[`console.timeEnd()`](https://developer.mozilla.org/en-US/docs/Web/API/console/timeEnd_static)
instead.

```jsx
console.time("My timer"); // starts a timer with label "My timer"
// do some work...
console.timeLog("My timer"); // outputs the current timer value, e.g. "My timer: 9000ms"
// do more work...
console.timeEnd("My timer"); // stops "My timer" and reports its value, e.g. "My timer: 97338ms"
```

You can create multiple timers each with their own label. Very handy!

## Counting things with `console.count()`

It can be helpful to keep a count of how many times specific operations in your
code have been executed. Rather than doing this manually you can use
[`console.count()`](https://developer.mozilla.org/en-US/docs/Web/API/console/count_static)
which can maintain multiple counters for you based on the label you provide.

```jsx
// increment the default counter
console.count();
console.count();
console.count();

/*
"default: 1"
"default: 2"
"default: 3"
*/
```

This can be very handy inside a function and passing in a label, like so:

```jsx
function pat(animal) {
  console.count(animal);
  return `Patting the ${animal}`;
}

pat("cat");
pat("cat");
pat("dog");
pat("cat");

/*
"cat: 1"
"cat: 2"
"dog: 1"
"cat: 3"
*/
```

## Going deeper with `console.trace()`

For a detailed view of what is happening in your application, you can output a
stack trace to the console with
[`console.trace()`](https://developer.mozilla.org/en-US/docs/Web/API/console/trace_static):

```jsx
// main.js
function foo() {
  function bar() {
    console.trace();
  }
  bar();
}

foo();

/*
Trace
    at bar (file:///PATH_TO/main.js:3:13)
    at foo (file:///PATH_TO/main.js:5:3)
    at file:///PATH_TO/main.js:8:1
*/
```

There’s more to explore, but these handy methods can give your JavaScript
debugging a boost and they are ready and waiting for you to use right in your
browser or in your Deno application.

Take a look at [console in the API references](/api/web/~/Console) of our docs
for more.

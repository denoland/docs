# HTTP headers

The [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
interface is part of the Fetch API. It allows you create and manipulate the HTTP
headers of request and response resources of fetch().

- [Constructor](#constructor)
  - [Parameters](#parameters)
- [Methods](#methods)
- [Example](#example)

## Constructor

The Header() constructor creates a new `Header` instance.

```ts
let headers = new Headers(init);
```

#### Parameters

| name | type                                    | optional | description                                                                                             |
| ---- | --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| init | `Headers` / `{ [key: string]: string }` | `true`   | The init option lets you initialize the headers object with an existing `Headers` or an object literal. |

The return type of the constructor is a `Headers` instance.

## Methods

| name                                  | description                                                       |
| ------------------------------------- | ----------------------------------------------------------------- |
| `append(name: string, value: string)` | Appends a header (overwrites existing one) to the Headers object. |
| `delete(name: string)`                | Deletes a header from the Headers object.                         |
| `set(name: string, value: string)`    | Create a new header in the Headers object.                        |
| `get(name: string)`                   | Get the value of the header in the Headers object.                |
| `has(name: string)`                   | Check if the header exists in the Headers objects.                |
| `entries()`                           | Get the headers as key-value pair. The result is iterable.        |
| `keys()`                              | Get all the keys of the Headers object. The result is iterable.   |

## Example

```ts
// Create a new headers object from an object literal.
const myHeaders = new Headers({
  accept: "application/json",
});

// Append a header to the headers object.
myHeaders.append("user-agent", "Deno Deploy");

// Print the headers of the headers object.
for (const [key, value] of myHeaders.entries()) {
  console.log(key, value);
}

// You can pass the headers instance to Response or Request constructors.
const request = new Request("https://api.github.com/users/denoland", {
  method: "POST",
  headers: myHeaders,
});
```

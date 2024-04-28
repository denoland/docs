/**
 * @title Built-in TypeScript support
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://www.typescriptlang.org/docs/handbook/intro.html} TypeScript handbook
 *
 * Deno natively understands TypeScript code with no compiler to configure.
 * Start writing code in .ts files, and the runtime will work with them just
 * fine.
 */

// Define an interface in TypeScript
interface Person {
  name: string;
  age: number;
}

// Provide a typed input to a function
function greet(person: Person) {
  return "Hello, " + person.name + "!";
}

// Everything works with zero config!
console.log(greet({ name: "Alice", age: 36 }));

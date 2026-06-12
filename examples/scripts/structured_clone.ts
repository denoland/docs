/**
 * @title Deep clone objects with structuredClone
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone} MDN: structuredClone
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm} MDN: Structured clone algorithm
 * @group Web Standard APIs
 *
 * structuredClone deep copies a value, so changes to the copy never leak
 * back into the original. Unlike the JSON round trip trick, it handles
 * Maps, Sets, Dates, typed arrays, and circular references. This example
 * shows what it copies, where it beats JSON, and what it refuses to clone.
 */

// Spread syntax and Object.assign only copy one level deep. structuredClone
// copies the whole tree, so mutating the copy leaves the original alone.
const original = { user: { name: "Ada" }, tags: ["math", "code"] };
const copy = structuredClone(original);

copy.user.name = "Grace";
copy.tags.push("navy");

console.log(original.user.name); // Ada
console.log(copy.user.name); // Grace
console.log(original.tags.length); // 2
console.log(copy.tags.length); // 3

// Built-in types like Map, Set, Date, and Uint8Array survive the clone as
// real instances, not as plain objects or strings.
const record = {
  scores: new Map([["ada", 99]]),
  visited: new Set(["home", "docs"]),
  created: new Date("2024-01-15T00:00:00Z"),
  bytes: new Uint8Array([1, 2, 3]),
};
const recordCopy = structuredClone(record);

console.log(recordCopy.scores instanceof Map); // true
console.log(recordCopy.scores.get("ada")); // 99
console.log(recordCopy.visited.has("docs")); // true
console.log(recordCopy.created.getUTCFullYear()); // 2024
console.log(recordCopy.bytes[2]); // 3

// Circular references are preserved. The copy points at itself exactly
// like the original did.
type TreeNode = { name: string; parent?: TreeNode };
const node: TreeNode = { name: "root" };
node.parent = node;

const nodeCopy = structuredClone(node);
console.log(nodeCopy.parent === nodeCopy); // true

// The JSON round trip cannot do that. It throws on circular values.
try {
  JSON.stringify(node);
} catch (err) {
  console.log((err as Error).name); // TypeError
}

// JSON also silently drops undefined values and functions, which can hide
// bugs. Note how both keys disappear without any error.
const lossy = JSON.parse(JSON.stringify({ a: 1, b: undefined, c: () => 1 }));
console.log(Object.keys(lossy)); // [ "a" ]

// structuredClone is honest instead. Functions cannot be cloned, so it
// throws a DOMException whose name is DataCloneError.
try {
  structuredClone({ run: () => 1 });
} catch (err) {
  console.log((err as DOMException).name); // DataCloneError
}

// Class instances lose their identity. Own data properties are copied,
// but the prototype is not, so methods are gone on the copy.
class Point {
  x: number;
  constructor(x: number) {
    this.x = x;
  }
  double(): number {
    return this.x * 2;
  }
}

const point = structuredClone(new Point(2));
console.log(point.x); // 2
console.log(point instanceof Point); // false
console.log(typeof (point as Point).double); // undefined

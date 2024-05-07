/**
 * @title Parsing and serializing JSON
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON} MDN: JSON
 * @group Encoding
 *
 * JSON is a widely used data interchange format. It is a human-readable, but
 * also easily machine-readable.
 */

// To parse a JSON string, you can use the builtin JSON.parse function. The
// value is returned as a JavaScript object.
const text = `{
  "hello": "world",
  "numbers": [1, 2, 3]
}`;
const data = JSON.parse(text);
console.log(data.hello);
console.log(data.numbers.length);

// To turn a JavaScript object into a JSON string, you can use the builtin
// JSON.stringify function.
const obj = {
  hello: "world",
  numbers: [1, 2, 3],
};
const json = JSON.stringify(obj);
console.log(json);
//- {"hello":"world","numbers":[1,2,3]}

// By default JSON.stringify will output a minified JSON string. You can
// customize this by specifying an indentation number in the third argument.
const json2 = JSON.stringify(obj, null, 2);
console.log(json2);
//- {
//-   "hello": "world",
//-   "numbers": [
//-     1,
//-     2,
//-     3
//-   ]
//- }

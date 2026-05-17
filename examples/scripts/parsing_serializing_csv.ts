/**
 * @title Parsing and serializing CSV
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run -R main.ts
 * @resource {/examples/import_export} Example: Importing & Exporting
 * @resource {/examples/reading_files} Example: Reading files
 * @resource {https://datatracker.ietf.org/doc/html/rfc4180} Spec: CSV
 * @group Encoding
 *
 * CSV is a data serialization format that is designed to be portable for table-like applications.
 */

// File: ./main.ts

import { parse, stringify } from "jsr:@std/csv";

// To parse a CSV string, you can use the standard library's CSV
// parse function. The value is returned as a JavaScript object.
let text = `
url,views,likes
https://deno.land,10,7
https://deno.land/x,20,15
https://deno.dev,30,23
`;
let data = parse(text, {
  skipFirstRow: true,
  strip: true,
});
console.log(data[0].url); // https://deno.land
console.log(data[0].views); // 10
console.log(data[0].likes); // 7

// If your CSV data is stored in a file, read the file as text before passing
// it to parse. Run this example with read permission: deno run -R main.ts.
const fileText = await Deno.readTextFile("./data.csv");
const fileData = parse(fileText, {
  skipFirstRow: true,
  strip: true,
});
console.log(fileData[1].url); // https://deno.land/x
console.log(fileData[1].views); // 20
console.log(fileData[1].likes); // 15

// In the case where our CSV is formatted differently, we are also able to
// provide the columns through code.
text = `
https://deno.land,10,7
https://deno.land/x,20,15
https://deno.dev,30,23
`;
data = parse(text, {
  columns: ["url", "views", "likes"],
});
console.log(data[0].url); // https://deno.land
console.log(data[0].views); // 10
console.log(data[0].likes); // 7

// To turn a list of JavaScript object into a CSV string, you can use the
// standard library's CSV stringify function.
const obj = [
  { mascot: "dino", fans: { old: 100, new: 200 } },
  { mascot: "bread", fans: { old: 5, new: 2 } },
];
const csv = stringify(obj, {
  columns: [
    "mascot",
    ["fans", "new"],
  ],
});
console.log(csv);
//- mascot,new
//- dino,200
//- bread,2

/* File: ./data.csv
url,views,likes
https://deno.land,10,7
https://deno.land/x,20,15
https://deno.dev,30,23
*/

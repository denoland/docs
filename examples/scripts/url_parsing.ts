/**
 * @title Manipulating & parsing URLs
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/URL} MDN: URL
 * @group Basics
 *
 * URL is the web standard interface to parse and manipulate URLs.
 */

// We can create a new object in a variety of ways
// In the most simple case we can simply just write the whole url
let url = new URL("https://deno.land/manual/introduction");

// Alternatively we are able to pass a (relative) url which will
// be automatically resolved to an absolute url
url = new URL("/manual/introduction", "https://deno.land");

// To get the full url out of an object, we can check the href property
console.log(url.href); // https://deno.land/manual/introduction

// We are also able to get various other properties from the url.
// Here are a few examples of properties we have access to.
console.log(url.host); // deno.land
console.log(url.origin); // https://deno.land
console.log(url.pathname); // /manual/introduction
console.log(url.protocol); // https:

// When parsing a url we often need to read the search parameters.
url = new URL("https://docs.deno.com/api/deno?s=Deno.readFile");

console.log(url.searchParams.get("s")); // Deno.readFile

// We're able to manipulate any of these parameters on the fly
url.host = "deno.com";
url.protocol = "http:";

console.log(url.href); // http://deno.com/api?s=Deno.readFile

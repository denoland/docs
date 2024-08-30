/**
 * @title Parsing and serializing JWT
 * @difficulty beginner
 * @tags cli, web
 * @run <url>
 * @resource {https://datatracker.ietf.org/doc/html/rfc7519}
 * @resource {https://jwt.io}
 * @group Encoding
 *
 * JWT is a widely used data claims format. It consists of 3 base64 encoded
 * sections: header, payload, signature.
 */

import { decode } from "https://deno.land/x/djwt/mod.ts";

// Prompt for the JWT token
const token = prompt("Please enter your token:"); // https://docs.deno.com/examples/prompts/

// sample JWT:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzUxMzkwMzV9.5i38qMNkU9ziQMEw6cL8ddn70mcFaAnJQZCvpvfTo5E

// Ensure the token is not null
if (token) {
  // Decode the token to get the payload
  const [header, payload, signature] = decode(token);

  // Ensure the token is properly decoded and contains the exp field
  if (payload && typeof payload === "object" && "exp" in payload) {
    const exp = payload.exp as number;

    // Show sections
    console.log("header values: ", header); // { alg: "HS256", typ: "JWT" }
    console.log("payload values: ", payload); // { sub: "1234567890", name: "John Doe", iat: 1516239022, exp: 1735139035 }
    console.log("signature values: ", signature); // omitted for brevity

    // Convert the exp value to a Date object
    const date = new Date(exp * 1000);

    console.log("exp as UTC date: ", date);
    console.log("exp as local date: ", date.toLocaleString());

    // Get the current time in seconds
    const now = Math.floor(Date.now() / 1000);

    // Check if the token has expired
    if (exp < now) {
      console.log("Token has expired");
    } else {
      console.log("Token is still valid");
    }
  } else {
    console.log("Invalid token or missing exp field. payload values:", payload);
  }
} else {
  console.log("No token provided");
}

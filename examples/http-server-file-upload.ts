/**
 * @title HTTP server: File upload
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net <url>
 * @resource {https://fresh.deno.dev/docs/concepts/forms#-handling-file-uploads} Handling File Uploads in Fresh
 * @resource {/examples/writing-files} Writing files
 * @resource {/examples/http-server-routing} Example: HTTP server: Server routing
 * @group Network
 *
 * An example HTTP server that provides sending and receiving of a file upload.<br><br>
 * <strong>This example is overly simplified and for demonstration purposes only:</strong><br>
 * In the "real world" forms should be validated (especially file type) and
 *  protect against cross-site request forgery.
 */

import { unescape } from "jsr:@std/html/entities";

// Set up an async function to use with Deno.serve().
async function handler(req: Request) {
  // Get the method from the incoming Request. The default is a GET request.
  const method: string = req.method;

  // Respond to a POST request which we receive if the form we create below is submitted.
  if (method === "POST") {
    // Get the file from the submitted FormData.
    const formData: FormData = await req.formData();
    const file: File | null = formData?.get("file") as File;
    // If we did not receive a file respond with a 400 status code and a message to explain.
    if (!file) {
      return new Response("File required but not provided.", { status: 400 });
    }

    // Here you would do more with the received file, in this example we're
    //  responding with the filename and the raw file byte code.
    return new Response(
      `File name: ${file.name} \n File content: ${await file.bytes()}`,
    );
  }

  // For all other requests other than POST (e.g. GET), let's create an HTML form element
  //  with an encType of 'multipart/form-data' and an input field for the user to select a
  // file from their computer.
  const inputForm = `
    &#x3C;form method=&#x22;POST&#x22; enctype=&#x22;multipart/form-data&#x22;&#x3E;
      &#x3C;input name=&#x22;file&#x22; type=&#x22;file&#x22; /&#x3E;
      &#x3C;button type=&#x22;submit&#x22;&#x3E;Upload&#x3C;/button&#x3E;
    &#x3C;/form&#x3E;
  `;

  // We need to specify the 'text/html' Content-Type to actually render the HTML form, this would normally be handled by a web framework, this example is designed to show the simplest way to handle a file upload over HTTP with Deno.
  const responseOptions: RequestInit = {
    headers: {
      "Content-Type": "text/html",
    },
  };
  // Note: We are only using unescape() here because our HTML string has been encoded for
  //  display in the documentation.
  return new Response(unescape(inputForm), responseOptions);
}

// Lastly we pass the handler we created to Deno.serve().
Deno.serve(handler);

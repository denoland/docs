---
title: "API server with DynamoDB"
oldUrl:
  - /deploy/docs/tutorial-dynamodb/
---

In this tutorial let's take a look at how we can use it to build a small API
that has endpoints to insert and retrieve information, backed by DynamoDB.

The tutorial assumes that you have an AWS and Deno Deploy account.

- [Overview](#overview)
- [Setup DynamoDB](#setup-dynamodb)
- [Create a Project in Deno Deploy](#create-a-project-in-deno-deploy)
- [Write the Application](#write-the-application)
- [Deploy the Application](#deploy-the-application)

## Overview

We're going to build an API with a single endpoint that accepts GET/POST
requests and returns appropriate information

```sh
# A GET request to the endpoint should return the details of the song based on its title.
GET /songs?title=Song%20Title # '%20' == space
# response
{
  title: "Song Title"
  artist: "Someone"
  album: "Something",
  released: "1970",
  genres: "country rap",
}

# A POST request to the endpoint should insert the song details.
POST /songs
# post request body
{
  title: "A New Title"
  artist: "Someone New"
  album: "Something New",
  released: "2020",
  genres: "country rap",
}
```

## Setup DynamoDB

Our first step in the process is to generate AWS credentials to programmatically
access DynamoDB.

Generate Credentials:

1. Go to https://console.aws.amazon.com/iam/ and go to "Users" section.
2. Click on **Create user** button, fill the **User name** field (maybe use
   `denamo`) and select **Programmatic access** type.
3. Click **Next**
4. Select **Attach policies directly** and search for
   `AmazonDynamoDBFullAccess`. Check the box next to this policy in the results.
5. Click **Next** and **Create user**
6. On the resulting **Users** page, click through to the user you just created
7. Click on **Create access key**
8. Select **Application running outside AWS**
9. Click ***Create**
10. Click **Download .csv file** to download the credentials you just created.

Create database table:

1. Go to https://console.aws.amazon.com/dynamodb and click on **Create table**
   button.
2. Fill the **Table name** field with `songs` and **Partition key** with
   `title`.
3. Scroll down and click on **Create table**.
4. Once the table is created, click on the table name and find its **General
   information**
5. Under **Amazon Resource Name (ARN)** take note of the region of your new
   table (for example us-east-1).

## Write the Application

Create a file called `index.js` and insert the following:

```js
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
// AWS has an official SDK that works with browsers. As most Deno Deploy's
// APIs are similar to browser's, the same SDK works with Deno Deploy.
// So we import the SDK along with some classes required to insert and
// retrieve data.
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://esm.sh/@aws-sdk/client-dynamodb";

// Create a client instance by providing your region information.
// The credentials are obtained from environment variables which
// we set during our project creation step on Deno Deploy.
const client = new DynamoDBClient({
  region: Deno.env.get("AWS_TABLE_REGION"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
  },
});

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // The endpoint allows GET and POST request. A parameter named "title"
  // for a GET request to be processed. And body with the fields defined
  // below are required to process POST request.
  // validateRequest ensures that the provided terms are met by the request.
  const { error, body } = await validateRequest(request, {
    GET: {
      params: ["title"],
    },
    POST: {
      body: ["title", "artist", "album", "released", "genres"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // Handle POST request.
  if (request.method === "POST") {
    try {
      // When we want to interact with DynamoDB, we send a command using the client
      // instance. Here we are sending a PutItemCommand to insert the data from the
      // request.
      const {
        $metadata: { httpStatusCode },
      } = await client.send(
        new PutItemCommand({
          TableName: "songs",
          Item: {
            // Here 'S' implies that the value is of type string
            // and 'N' implies a number.
            title: { S: body.title },
            artist: { S: body.artist },
            album: { S: body.album },
            released: { N: body.released },
            genres: { S: body.genres },
          },
        }),
      );

      // On a successful put item request, dynamo returns a 200 status code (weird).
      // So we test status code to verify if the data has been inserted and respond
      // with the data provided by the request as a confirmation.
      if (httpStatusCode === 200) {
        return json({ ...body }, { status: 201 });
      }
    } catch (error) {
      // If something goes wrong while making the request, we log
      // the error for our reference.
      console.log(error);
    }

    // If the execution reaches here it implies that the insertion wasn't successful.
    return json({ error: "couldn't insert data" }, { status: 500 });
  }

  // Handle GET request.
  try {
    // We grab the title form the request and send a GetItemCommand
    // to retrieve the information about the song.
    const { searchParams } = new URL(request.url);
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: "songs",
        Key: {
          title: { S: searchParams.get("title") },
        },
      }),
    );

    // The Item property contains all the data, so if it's not undefined,
    // we proceed to returning the information about the title
    if (Item) {
      return json({
        title: Item.title.S,
        artist: Item.artist.S,
        album: Item.album.S,
        released: Item.released.S,
        genres: Item.genres.S,
      });
    }
  } catch (error) {
    console.log(error);
  }

  // We might reach here if an error is thrown during the request to database
  // or if the Item is not found in the database.
  // We reflect both conditions with a general message.
  return json(
    {
      message: "couldn't find the title",
    },
    { status: 404 },
  );
}
```

Initialize git in your new project and
[push it to GitHub](https://docs.github.com/en/get-started/start-your-journey/hello-world#step-1-create-a-repository).

## Deploy the Application

Now that we have everything in place, let's deploy your new application!

1. In your browser, visit [Deno Deploy](https://dash.deno.com/new_project) and
   link your GitHub account.
2. Select the repository which contains your new application.
3. You can give your project a name or allow Deno to generate one for you
4. Select `index.js` in the Entrypoint dropdown
5. Click **Deploy Project**

In order for your Application to work, we will need to configure its environment
variables.

On your project's success page, or in your project dashboard, click on **Add
environmental variables**. Under Environment Variables, click **+ Add
Variable**. Create the following variables:

1. `AWS_ACCESS_KEY_ID` - with the value from the CSV you downloaded
2. `AWS_SECRET_ACCESS_KEY` - with the value from the CSV you downloaded.
3. `AWS_TABLE_REGION` - with your table's region

Click to save the variables.

Let's test the API.

POST some data.

```sh
curl --request POST --data \
'{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "Country rap, Pop"}' \
--dump-header - https://<project_name>.deno.dev/songs
```

GET information about the title.

```sh
curl https://<project_name>.deno.dev/songs?title=Old%20Town%20Road
```

Congratulations on learning how to use DynamoDB with Deno Deploy!

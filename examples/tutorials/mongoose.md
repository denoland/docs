---
title: "How to use Mongoose with Deno"
description: "Step-by-step guide to using Mongoose with Deno. Learn how to set up MongoDB connectivity, create schemas, implement data models, and perform CRUD operations using Mongoose's schema-based modeling."
url: /examples/mongoose_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/mongoose/
  - /runtime/tutorials/how_to_with_npm/mongoose/
---

[Mongoose](https://mongoosejs.com/) is a popular, schema-based library that
models data for [MongoDB](https://www.mongodb.com/). It simplifies writing
MongoDB validation, casting, and other relevant business logic.

This tutorial will show you how to setup Mongoose and MongoDB with your Deno
project.

[View source](https://github.com/denoland/examples/tree/main/with-mongoose) or
[check out the video guide](https://youtu.be/dmZ9Ih0CR9g).

## Creating a Mongoose Model

Let's create a simple app that connects to MongoDB, creates a `Dinosaur` model,
and adds and updates a dinosaur to the database.

First, we'll create the necessary files and directories:

```console
touch main.ts && mkdir model && touch model/Dinosaur.ts
```

In `/model/Dinosaur.ts`, we'll import `npm:mongoose`, define the [schema], and
export it:

```ts
import { model, Schema } from "npm:mongoose@^6.7";

// Define schema.
const dinosaurSchema = new Schema({
  name: { type: String, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Validations
dinosaurSchema.path("name").required(true, "Dinosaur name cannot be blank.");
dinosaurSchema.path("description").required(
  true,
  "Dinosaur description cannot be blank.",
);

// Export model.
export default model("Dinosaur", dinosaurSchema);
```

## Connecting to MongoDB

Now, in our `main.ts` file, we'll import mongoose and the `Dinosaur` schema, and
connect to MongoDB:

```ts
import mongoose from "npm:mongoose@^6.7";
import Dinosaur from "./model/Dinosaur.ts";

await mongoose.connect("mongodb://localhost:27017");

// Check to see connection status.
console.log(mongoose.connection.readyState);
```

Because Deno supports top-level `await`, we're able to simply
`await mongoose.connect()`.

Running this, we should expect a log of `1`:

```shell
$ deno run --allow-read --allow-sys --allow-env --allow-net main.ts
1
```

It worked!

## Manipulating Data

Let's add an instance [method](https://mongoosejs.com/docs/guide.html#methods)
to our `Dinosaur` schema in `/model/Dinosaur.ts`:

```ts
// ./model/Dinosaur.ts

// Methods.
dinosaurSchema.methods = {
  // Update description.
  updateDescription: async function (description: string) {
    this.description = description;
    return await this.save();
  },
};

// ...
```

This instance method, `updateDescription`, will allow you to update a record's
description.

Back in `main.ts`, let's start adding and manipulating data in MongoDB.

```ts
// main.ts

// Create a new Dinosaur.
const deno = new Dinosaur({
  name: "Deno",
  description: "The fastest dinosaur ever lived.",
});

// // Insert deno.
await deno.save();

// Find Deno by name.
const denoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(
  `Finding Deno in MongoDB -- \n  ${denoFromMongoDb.name}: ${denoFromMongoDb.description}`,
);

// Update description for Deno and save it.
await denoFromMongoDb.updateDescription(
  "The fastest and most secure dinosaur ever lived.",
);

// Check MongoDB to see Deno's updated description.
const newDenoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(
  `Finding Deno (again) -- \n  ${newDenoFromMongoDb.name}: ${newDenoFromMongoDb.description}`,
);
```

Running the code, we get:

```console
Finding Deno in MongoDB --
  Deno: The fastest dinosaur ever lived.
Finding Deno (again) --
  Deno: The fastest and most secure dinosaur ever lived.
```

Boom!

For more info on using Mongoose, please refer to
[their documentation](https://mongoosejs.com/docs/guide.html).

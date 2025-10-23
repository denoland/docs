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

```ts title="model/Dinosaur.ts"
import mongoose, {
  type HydratedDocument,
  type Model,
  model,
  models,
  Schema,
} from "npm:mongoose@latest";

interface Dinosaur {
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DinosaurMethods {
  updateDescription(
    this: HydratedDocument<Dinosaur>,
    description: string,
  ): Promise<
    HydratedDocument<Dinosaur>
  >;
}

type DinosaurModel = Model<Dinosaur, {}, DinosaurMethods>;

const dinosaurSchema = new Schema<Dinosaur, DinosaurModel, DinosaurMethods>(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

dinosaurSchema.methods.updateDescription = async function (
  this: HydratedDocument<Dinosaur>,
  description: string,
) {
  this.description = description;
  return await this.save();
};

export default (models.Dinosaur as DinosaurModel) ||
  model<Dinosaur, DinosaurModel>("Dinosaur", dinosaurSchema);
```

## Connecting to MongoDB

Now, in our `main.ts` file, we'll import mongoose and the `Dinosaur` schema, and
connect to MongoDB:

```ts
import mongoose from "npm:mongoose@latest";
import Dinosaur from "./model/Dinosaur.ts";

const MONGODB_URI = Deno.env.get("MONGODB_URI") ??
  "mongodb://localhost:27017/deno_mongoose_tutorial";

await mongoose.connect(MONGODB_URI);

console.log(mongoose.connection.readyState);
```

Because Deno supports top-level `await`, we're able to simply
`await mongoose.connect()`.

Running the code with this command:

```shell
deno run --allow-env --allow-net main.ts
```

We expect a log of `1`.

## Manipulating Data

Let's add a typed instance
[method](https://mongoosejs.com/docs/guide.html#methods) to our `Dinosaur`
schema in `/model/Dinosaur.ts`:

```ts title="model/Dinosaur.ts"
dinosaurSchema.methods.updateDescription = async function (
  this: HydratedDocument<Dinosaur>,
  description: string,
) {
  this.description = description;
  return await this.save();
};

// ...
```

This instance method, `updateDescription`, will allow you to update a record's
description.

Back in `main.ts`, let's start adding and manipulating data in MongoDB.

```ts title="main.ts"
const deno = new Dinosaur({
  name: "Deno",
  description: "The fastest dinosaur that ever lived.",
});

await deno.save();

const denoFromMongoDb = await Dinosaur.findOne({ name: "Deno" }).exec();
if (!denoFromMongoDb) throw new Error("Deno not found");
console.log(
  `Finding Deno in MongoDB -- \n  ${denoFromMongoDb.name}: ${denoFromMongoDb.description}`,
);

await denoFromMongoDb.updateDescription(
  "The fastest and most secure dinosaur that ever lived.",
);

const newDenoFromMongoDb = await Dinosaur.findOne({ name: "Deno" }).exec();
if (!newDenoFromMongoDb) throw new Error("Deno not found after update");
console.log(
  `Finding Deno (again) -- \n  ${newDenoFromMongoDb.name}: ${newDenoFromMongoDb.description}`,
);
```

Running the code, we get:

```console
Finding Deno in MongoDB --
  Deno: The fastest dinosaur that ever lived.
Finding Deno (again) --
  Deno: The fastest and most secure dinosaur that ever lived.
```

🦕 Now you have a fully functional Deno application using Mongoose to interact
with MongoDB!

For more info on using Mongoose, please refer to
[their documentation](https://mongoosejs.com/docs/guide.html).

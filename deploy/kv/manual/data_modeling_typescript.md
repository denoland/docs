---
title: "Data Modeling in TypeScript"
oldUrl:
  - /kv/manual/data_modeling_typescript/
---

<deno-admonition></deno-admonition>

In TypeScript applications, it is usually desirable to create strongly-typed,
well-documented objects to contain the data that your application operates on.
Using [interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
or [classes](https://www.typescriptlang.org/docs/handbook/2/classes.html), you
can describe both the shape and behavior of objects in your programs.

If you are using Deno KV, however, there is a bit of extra work required to
persist and retrieve objects that are strongly typed. In this guide, we'll cover
strategies for working with strongly typed objects going into and back out from
Deno KV.

## Using interfaces and type assertions

When storing and retrieving application data in Deno KV, you might want to begin
by describing the shape of your data using TypeScript interfaces. Below is an
object model which describes some key components of a blogging system:

```ts title="model.ts"
export interface Author {
  username: string;
  fullName: string;
}

export interface Post {
  slug: string;
  title: string;
  body: string;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
}
```

This object model describes a blog post and an associated author.

With Deno KV, you can use these TypeScript interfaces like
[data transfer objects (DTOs)](https://martinfowler.com/bliki/LocalDTO.html) - a
strongly typed wrapper around the otherwise untyped objects you might send to or
receive from Deno KV.

Without any additional work, you can happily store the contents of one of these
DTOs in Deno KV.

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const a: Author = {
  username: "acdoyle",
  fullName: "Arthur Conan Doyle",
};

await kv.set(["authors", a.username], a);
```

When retreiving this same object from Deno KV, however, it won't by default have
type information associated with it. If you know the shape of the object that
was stored for the key, however, you can use
[type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
to inform the TypeScript compiler about the shape of an object.

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const r = await kv.get(["authors", "acdoyle"]);
const ac = r.value as Author;

console.log(ac.fullName);
```

You can also specify an optional
[type parameter](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.get)
for `get`:

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const r = await kv.get<Author>(["authors", "acdoyle"]);

console.log(r.value.fullName);
```

For simpler data structures, this technique may be sufficient. But often, you
will want or need to apply some business logic when creating or accessing your
domain objects. When this need arises, you can develop a set of pure functions
that can operate on your DTOs.

## Encapsulating business logic with a service layer

When your application's persistence needs become more complex - such as when you
need to create [secondary indexes](./secondary_indexes) to query your data by
different keys, or maintain relationships between objects - you will want to
create a set of functions to sit on top of your DTOs to ensure that the data
being passed around is valid (and not merely typed correctly).

From our business objects above, the `Post` object is complex enough where it is
likely to need a small layer of code to save and retrieve an instance of the
object. Below is an example of two functions that wrap the underlying Deno KV
APIs, and return strongly typed object instances for the `Post` interface.

Notably, we need to store an identifier for an `Author` object, so we can
retrieve author information from KV later.

```ts
import { Author, Post } from "./model.ts";

const kv = await Deno.openKv();

interface RawPost extends Post {
  authorUsername: string;
}

export async function savePost(p: Post): Promise<Post> {
  const postData: RawPost = Object.assign({}, p, {
    authorUsername: p.author.username,
  });

  await kv.set(["posts", p.slug], postData);
  return p;
}

export async function getPost(slug: string): Promise<Post> {
  const postResponse = await kv.get(["posts", slug]);
  const rawPost = postResponse.value as RawPost;
  const authorResponse = await kv.get(["authors", rawPost.authorUsername]);

  const author = authorResponse.value as Author;
  const post = Object.assign({}, postResponse.value, {
    author,
  }) as Post;

  return post;
}
```

This thin layer uses a `RawPost` interface, which extends the actual `Post`
interface, to include some additional data that is used to reference data at
another index (the associated `Author` object).

The `savePost` and `getPost` functions take the place of a direct Deno KV `get`
or `set` operation, so that they can properly serialize and "hydrate" model
objects for us with appropriate types and associations.

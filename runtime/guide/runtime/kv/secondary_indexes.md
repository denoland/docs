# Secondary Indexes

> ⚠️ Deno KV is currently **experimental** and **subject to change**. While we do
> our best to ensure data durability, data loss is possible, especially around
> Deno updates. We recommend that you backup your data regularly and consider
> storing data in a secondary store for the time being.

> 🌐 Deno KV is available in closed beta for Deno Deploy.
> [Read the Deno Deploy KV docs](/deploy/guide/kv).

Key-value stores like Deno KV organize data as collections of key-value pairs,
where each unique key is associated with a single value. This structure enables
easy retrieval of values based on their keys but does not allow for querying
based on the values themselves. To overcome this constraint, you can create
secondary indexes, which store the same value under additional keys that include
(part of) that value.

Maintaining consistency between primary and secondary keys is crucial when using
secondary indexes. If a value is updated at the primary key without updating the
secondary key, the data returned from a query targeting the secondary key will
be incorrect. To ensure that primary and secondary keys always represent the
same data, use atomic operations when inserting, updating, or deleting data.
This approach ensures that the group of mutation actions are executed as a
single unit, and either all succeed or all fail, preventing inconsistencies.

## Unique indexes (one-to-one)

Unique indexes have each key in the index associated with exactly one primary
key. For example, when storing user data and looking up users by both their
unique IDs and email addresses, store user data under two separate keys: one for
the primary key (user ID) and another for the secondary index (email). This
setup allows querying users based on either their ID or their email. The
secondary index can also enforce uniqueness constraints on values in the store.
In the case of user data, use the index to ensure that each email address is
associated with only one user - in other words that emails are unique.

To implement a unique secondary index for this example, follow these steps:

1. Create a `User` interface representing the data:

   ```tsx
   interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

2. Define an `insertUser` function that stores user data at both the primary and
   secondary keys:

   ```tsx,ignore
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byEmailKey = ["users_by_email", user.email];
     const res = await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .check({ key: byEmailKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byEmailKey, user)
       .commit();
     if (!res.ok) {
       throw new TypeError("User with ID or email already exists");
     }
   }
   ```

   > This function performs the insert using an atomic operation that checks
   > that no user with the same ID or email already exists. If either of these
   > constraints is violated, the insert fails and no data is modified.

3. Define a `getUser` function to retrieve a user by their ID:

   ```tsx,ignore
   async function getUser(id: string): Promise<User | null> {
     const res = await kv.get<User>(["users", id]);
     return res.value;
   }
   ```

4. Define a `getUserByEmail` function to retrieve a user by their email address:

   ```tsx,ignore
   async function getUserByEmail(email: string): Promise<User | null> {
     const res = await kv.get<User>(["users_by_email", email]);
     return res.value;
   }
   ```

   This function queries the store using the secondary key
   (`["users_by_email", email]`).

5. Define a deleteUser function to delete users by their ID:

   ```tsx,ignore
   async function deleteUser(id: string) {
     let res = { ok: false };
     while (!res.ok) {
       const getRes = await kv.get<User>(["users", id]);
       if (getRes.value === null) return;
       res = await kv.atomic()
         .check(getRes)
         .delete(["users", id])
         .delete(["users_by_email", getRes.value.email])
         .commit();
     }
   }
   ```

   <!-- deno-fmt-ignore -->
   > This function first retrieves the user by their ID to get the users email
   > address. This is needed to retrieve the email that is needed to construct
   > the key for the secondary index for this user address. It then performs an
   > atomic operation that checks that the user in the database has not changed,
   > and then deletes both the primary and secondary key pointing to the user
   > value. If this fails (the user has been modified between query and delete),
   > the atomic operation aborts. The entire procedure is retried until the
   > delete succeeds.
   > 
   > The check is required to prevent race conditions where
   > value may have been modified between the retrieve and delete. This race can
   > occur if an update changes the user's email, because the secondary index
   > moves in this case. The delete of the secondary index then fails, because
   > the delete is targeting the old secondary index key.

## Non-Unique Indexes (One-to-Many)

Non-unique indexes are secondary indexes where a single key can be associated
with multiple primary keys, allowing you to query for multiple items based on a
shared attribute. For example, when querying users by their favorite color,
implement this using a non-unique secondary index. The favorite color is a
non-unique attribute since multiple users can have the same favorite color.

To implement a non-unique secondary index for this example, follow these steps:

1. Define the `User` interface:

   ```ts
   interface User {
     id: string;
     name: string;
     favoriteColor: string;
   }
   ```

2. Define the `insertUser` function:

   <!-- deno-fmt-ignore -->
   ```ts,ignore
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byColorKey = ["users_by_favorite_color", user.favoriteColor, user.id];
     await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byColorKey, user)
       .commit();
   }
   ```

3. Define a function to retrieve users by their favorite color:

   ```ts,ignore
   async function getUsersByFavoriteColor(color: string): Promise<User[]> {
     const iter = kv.list<User>({ prefix: ["users_by_favorite_color", color] });
     const users = [];
     for await (const { value } of iter) {
       users.push(value);
     }
     return users;
   }
   ```

This example demonstrates the use of a non-unique secondary index,
`users_by_favorite_color`, which allows querying users based on their favorite
color. The primary key remains the user `id`.

The primary difference between the implementation of unique and non-unique
indexes lies in the structure and organization of the secondary keys. In unique
indexes, each secondary key is associated with exactly one primary key, ensuring
that the indexed attribute is unique across all records. In the case of
non-unique indexes, a single secondary key can be associated with multiple
primary keys, as the indexed attribute may be shared among multiple records. To
achieve this, non-unique secondary keys are typically structured with an
additional unique identifier (e.g., primary key) as part of the key, allowing
multiple records with the same attribute to coexist without conflicts.

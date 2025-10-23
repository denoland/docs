---
title: "Secondary Indexes"
oldUrl:
  - /runtime/manual/runtime/kv/secondary_indexes
  - /kv/manual/secondary_indexes
  - /deploy/kv/manual/secondary_indexes/
---

Key-value stores like Deno KV organize data as collections of key-value pairs,
where each unique key is associated with a single value. This structure enables
easy retrieval of values based on their keys but does not allow for querying
based on the values themselves. To overcome this constraint, you can create
secondary indexes, which store an additional key that lets you look up related
data by an alternate attribute (for example, email → user). A best practice is
to store a pointer to the primary key in the secondary index, rather than
duplicating the full value.

:::tip Recommended approach for Pointer indexes

Prefer storing the primary key (or a compact reference to it) as the value in a
secondary index. This reduces storage usage and avoids keeping multiple copies
of the same data in sync. The trade‑off is a double read when querying through
the index (index → primary).

Pros

- Lower storage and write amplification
- Fewer updates when non‑indexed fields change
- Clearer transactional updates: update primary + index together

Cons

- Requires a second read to resolve the primary value
- You must maintain referential integrity atomically (create/update/delete in a
  single transaction)

:::

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
the primary key (user ID) and another for the secondary index (email → user ID).
This setup allows querying users based on either their ID or their email. The
secondary index can also enforce uniqueness constraints on values in the store.
In the case of user data, use the index to ensure that each email address is
associated with only one user.

To implement a unique secondary index for this example, follow these steps:

1. Create a `User` interface representing the data:

   ```ts
   interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

2. Define an `insertUser` function that stores user data at the primary key and
   stores a pointer (the primary key) at the secondary key:

   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id] as const;
     const byEmailKey = ["users_by_email", user.email.toLowerCase()] as const;
     const res = await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .check({ key: byEmailKey, versionstamp: null })
       .set(primaryKey, user)
       // store pointer, not full user
       .set(byEmailKey, user.id)
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

   ```ts
   async function getUser(id: string): Promise<User | null> {
     const res = await kv.get<User>(["users", id]);
     return res.value;
   }
   ```

4. Define a `getUserByEmail` function to retrieve a user by their email address
   using a double lookup (email → user ID → user):

   ```ts
   async function getUserByEmail(email: string): Promise<User | null> {
     const idRes = await kv.get<string>([
       "users_by_email",
       email.toLowerCase(),
     ]);
     if (!idRes.value) return null;
     const res = await kv.get<User>(["users", idRes.value]);
     return res.value;
   }
   ```

   This function queries the store using the secondary key
   (`["users_by_email", email]`).

5. Define a `deleteUser` function to delete users by their ID, removing the
   index entry too:

   ```ts
   async function deleteUser(id: string) {
     let res = { ok: false } as { ok: boolean };
     while (!res.ok) {
       const cur = await kv.get<User>(["users", id]);
       if (cur.value === null) return;
       res = await kv.atomic()
         .check(cur)
         .delete(["users", id])
         .delete(["users_by_email", cur.value.email.toLowerCase()])
         .commit();
     }
   }
   ```

   > This function first retrieves the user by their ID to get the users email
   > address. This is needed to retrieve the email that is needed to construct
   > the key for the secondary index for this user address. It then performs an
   > atomic operation that checks that the user in the database has not changed,
   > and then deletes both the primary and secondary key pointing to the user
   > value. If this fails (the user has been modified between query and delete),
   > the atomic operation aborts. The entire procedure is retried until the
   > delete succeeds. The check is required to prevent race conditions where
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

2. Define the `insertUser` function (store the primary key as the value in the
   non‑unique index; note the composite key includes the user ID to avoid
   collisions):

   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id] as const;
     const byColorKey = [
       "users_by_favorite_color",
       user.favoriteColor,
       user.id,
     ] as const;
     await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .set(primaryKey, user)
       // store pointer, not full user
       .set(byColorKey, user.id)
       .commit();
   }
   ```

3. Define a function to retrieve users by their favorite color. This performs a
   double lookup per result (index → primary):

   ```ts
   async function getUsersByFavoriteColor(color: string): Promise<User[]> {
     const iter = kv.list<string>({
       prefix: ["users_by_favorite_color", color],
     });
     const ids: string[] = [];
     for await (const { value: id } of iter) {
       ids.push(id);
     }
     if (ids.length === 0) return [];
     const results = await kv.getMany<User>(
       ids.map((id) => ["users", id] as const),
     );
     return results.map((r) => r.value!).filter(Boolean);
   }
   ```

This example demonstrates the use of a non-unique secondary index,
`users_by_favorite_color`, which allows querying users based on their favorite
color. The index stores pointers (user IDs) and requires resolving to the
primary key to read full values.

The primary difference between unique and non‑unique indexes lies in the
structure and organization of secondary keys. In unique indexes, each secondary
key is associated with exactly one primary key, ensuring that the indexed
attribute is unique across all records. In non‑unique indexes, a single
secondary key can be associated with multiple primary keys, as the indexed
attribute may be shared among multiple records. To achieve this, non‑unique
secondary keys are typically structured with an additional unique identifier
(e.g., primary key) as part of the key, allowing multiple records with the same
attribute to coexist without conflicts.

### When duplicating values may be acceptable

While pointer indexes are recommended, duplicating the full value in a secondary
index can be acceptable when:

- The value is small and reads occur almost exclusively via the secondary index
- You want to avoid a second read and can tolerate the extra storage
- You can reliably keep the primary and secondary in sync via atomic
  transactions

If duplicating, ensure inserts/updates/deletes modify both keys in the same
atomic transaction.

### Migration from duplicated-value indexes

To migrate existing duplicated-value indexes to pointer indexes:

1. Backfill: scan primary keys and set secondary index values to the primary key
   (e.g., user ID).
2. Cutover: update write paths to maintain pointer indexes; keep the old index
   temporarily for reads.
3. Cleanup: switch readers to the pointer index, then remove the duplicated
   index entries.

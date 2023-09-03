# Transactions

> ⚠️ Deno KV is currently **experimental** and **subject to change**. While we do
> our best to ensure data durability, data loss is possible, especially around
> Deno updates. We recommend that you backup your data regularly and consider
> storing data in a secondary store for the time being.

> A database transaction, in the context of a key-value store like Deno KV,
> refers to a sequence of data manipulation operations executed as a single,
> atomic unit of work to ensure data consistency, integrity, and durability.
> These operations, typically comprising read, write, update, and delete actions
> on key-value pairs, adhere to the ACID (Atomicity, Consistency, Isolation, and
> Durability) properties, which guarantee that either all operations within the
> transaction are successfully completed, or the transaction is rolled back to
> its initial state in the event of a failure, leaving the database unchanged.
> This approach allows multiple users or applications to interact with the KV
> store concurrently, while maintaining the database's consistency, reliability
> and stability.

The Deno KV store utilizes _optimistic concurrency control transactions_ rather
than _interactive transactions_ like many SQL systems like PostgreSQL or MySQL.
This approach employs versionstamps, which represent the current version of a
value for a given key, to manage concurrent access to shared resources without
using locks. When a read operation occurs, the system returns a versionstamp for
the associated key in addition to the value.

To execute a transaction, one performs an atomic operations that can consist of
multiple mutation actions (like set or delete). Along with these actions,
key+versionstamp pairs are provided as a condition for the transaction's
success. The optimistic concurrency control transaction will only commit if the
specified versionstamps match the current version for the values in the database
for the corresponding keys. This transaction model ensures data consistency and
integrity while allowing concurrent interactions within the Deno KV store.

Because OCC transactions are optimistic, they can fail on commit because the
version constraints specified in the atomic operation were violated. This occurs
when an agent updates a key used within the transaction between read and commit.
When this happens, the agent performing the transaction must retry the
transaction.

To illustrate how to use OCC transactions with Deno KV, this example shows how
to implement a `transferFunds(from: string, to: string, amount: number)`
function for an account ledger. The account ledger stores the balance for each
account in the key-value store. The keys are prefixed by `"account"`, followed
by the account identifier: `["account", "alice"]`. The value stored for each key
is a number that represents the account balance.

Here's a step-by-step example of implementing this `transferFunds` function:

<!-- deno-fmt-ignore -->
```ts,ignore
async function transferFunds(sender: string, receiver: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");

  // Construct the KV keys for the sender and receiver accounts.
  const senderKey = ["account", sender];
  const receiverKey = ["account", receiver];

  // Retry the transaction until it succeeds.
  let res = { ok: false };
  while (!res.ok) {
    // Read the current balance of both accounts.
    const [senderRes, receiverRes] = await kv.getMany([senderKey, receiverKey]);
    if (senderRes.value === null) throw new Error(`Account ${sender} not found`);
    if (receiverRes.value === null) throw new Error(`Account ${receiver} not found`);

    const senderBalance = senderRes.value;
    const receiverBalance = receiverRes.value;

    // Ensure the sender has a sufficient balance to complete the transfer.
    if (senderBalance < amount) {
      throw new Error(
        `Insufficient funds to transfer ${amount} from ${sender}`,
      );
    }

    // Perform the transfer.
    const newSenderBalance = senderBalance - amount;
    const newReceiverBalance = receiverBalance + amount;

    // Attempt to commit the transaction. `res` returns an object with
    // `ok: false` if the transaction fails to commit due to a check failure
    // (i.e. the versionstamp for a key has changed)
    res = await kv.atomic()
      .check(senderRes) // Ensure the sender's balance hasn't changed.
      .check(receiverRes) // Ensure the receiver's balance hasn't changed.
      .set(senderKey, newSenderBalance) // Update the sender's balance.
      .set(receiverKey, newReceiverBalance) // Update the receiver's balance.
      .commit();
  }
}
```

In this example, the `transferFunds` function reads the balances and
versionstamps of both accounts, calculates the new balances after the transfer,
and checks if there are sufficient funds in account A. It then performs an
atomic operation, setting the new balances with the versionstamp constraints. If
the transaction is successful, the loop exits. If the version constraints are
violated, the transaction fails, and the loop retries the transaction until it
succeeds.

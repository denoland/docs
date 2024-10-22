---
title: "Transactions"
oldUrl:
  - /runtime/manual/runtime/kv/transactions/
  - /kv/manual/transactions/
---

<deno-admonition></deno-admonition>

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

```ts
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
    if (senderRes.value === null) {
      throw new Error(`Account ${sender} not found`);
    }
    if (receiverRes.value === null) {
      throw new Error(`Account ${receiver} not found`);
    }

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

## Limits

In addition to a max key size of 2 KiB and max value size of 64 KiB, there are
certain limits with the Deno KV transaction API:

- **Max keys per `kv.getMany()`**: 10
- **Max batch size per `kv.list()`**: 1000
- **Max checks in an atomic operation**: 100
- **Max mutations in an atomic operation**: 1000
- **Max total size of an atomic operation**: 800 KiB. This includes all keys and
  values in checks and mutations, and encoding overhead counts toward this limit
  as well.
- **Max total size of keys**: 90 KiB. This includes all keys in checks and
  mutations, and encoding overhead counts toward this limit as well.
- **Max watched keys per `kv.watch()`**：10

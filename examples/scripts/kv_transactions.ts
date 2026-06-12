/**
 * @title Atomic transactions in Deno KV
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --unstable-kv <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.AtomicOperation} Doc: Deno.AtomicOperation
 * @resource {https://docs.deno.com/examples/kv/} Example: Deno KV
 * @group Deno KV and scheduling
 *
 * <strong>Warning: This is an unstable API that is subject to change or removal at anytime.</strong><br>Deno KV transactions group reads and writes so they either all happen
 * or none do, with optimistic concurrency: a transaction only commits if
 * the values it read have not changed in the meantime. This example
 * transfers funds between two accounts safely and shows the retry pattern
 * used when transactions race.
 */

// Use an in-memory database for the example; omit the argument to open the
// default persistent database.
const kv = await Deno.openKv(":memory:");

await kv.set(["account", "alice"], 100);
await kv.set(["account", "bob"], 50);

// A transfer must read both balances, check the funds, and write both new
// balances as one unit. Each get returns the value together with a
// versionstamp identifying the exact revision that was read.
async function transfer(from: string, to: string, amount: number) {
  // Retry until the transaction commits. Commits fail only when another
  // writer changed one of the checked keys between our read and our write,
  // in which case we re-read and try again.
  while (true) {
    const fromEntry = await kv.get<number>(["account", from]);
    const toEntry = await kv.get<number>(["account", to]);
    if ((fromEntry.value ?? 0) < amount) {
      throw new Error("insufficient funds");
    }

    // check() asserts the versionstamps are still current at commit time.
    // If both checks pass, the two sets are applied atomically.
    const result = await kv.atomic()
      .check(fromEntry, toEntry)
      .set(["account", from], fromEntry.value! - amount)
      .set(["account", to], (toEntry.value ?? 0) + amount)
      .commit();
    if (result.ok) return;
  }
}

await transfer("alice", "bob", 25);
console.log((await kv.get(["account", "alice"])).value); // 75
console.log((await kv.get(["account", "bob"])).value); // 75

// For plain counters there is a shortcut: mutate with type "sum" adds to a
// value without needing a check, so concurrent increments never conflict.
// Sums use the 64-bit unsigned KvU64 wrapper type.
await kv.atomic().sum(["visits"], 1n).commit();
await kv.atomic().sum(["visits"], 1n).commit();
console.log((await kv.get(["visits"])).value); // [Deno.KvU64: 2n]

// A failed check leaves the database untouched and returns ok: false. Here
// the entry goes stale on purpose: the key is written again after we read
// it, so the versionstamp no longer matches.
const stale = await kv.get<number>(["account", "alice"]);
await kv.set(["account", "alice"], 75); // bump the versionstamp
const result = await kv.atomic()
  .check(stale)
  .set(["account", "alice"], 0)
  .commit();
console.log(result.ok); // false

kv.close();

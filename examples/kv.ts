/**
 * @title Deno KV: Key/Value database
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --unstable-kv <url>
 * @resource {https://docs.deno.com/deploy/kv/manual} Deno KV user guide
 * @resource {https://docs.deno.com/api/deno/~/Deno.Kv} Deno KV Runtime API docs
 * @group Unstable APIs
 *
 * <strong>Warning: This is an unstable API that is subject to change or removal at anytime.</strong><br>Deno KV is a key/value database built in to the Deno runtime, and works with
 * zero configuration on Deno Deploy. It's great for use cases that require fast
 * reads and don't require the query flexibility of a SQL database.
 */

// Open the default database
const kv = await Deno.openKv();

// Define an interface in TypeScript for our data
enum Rank {
  Bronze,
  Silver,
  Gold,
}

interface Player {
  username: string;
  rank: Rank;
}

// Create a few instances for testing
const player1: Player = { username: "carlos", rank: Rank.Bronze };
const player2: Player = { username: "briana", rank: Rank.Silver };
const player3: Player = { username: "alice", rank: Rank.Bronze };

// Store object data in Deno KV using the "set" operation. Keys can be arranged
// hierarchically, not unlike resources in a REST API.
await kv.set(["players", player1.username], player1);
await kv.set(["players", player2.username], player2);
await kv.set(["players", player3.username], player3);

// The "set" operation is used to both create and update data for a given key
player3.rank = Rank.Gold;
await kv.set(["players", player3.username], player3);

// Fetch a single object by key with the "get" operation
const record = await kv.get(["players", "alice"]);
const alice: Player = record.value as Player;
console.log(record.key, record.versionstamp, alice);

// Fetch several objects by key with "getMany"
const [record1, record2] = await kv.getMany([
  ["players", "carlos"],
  ["players", "briana"],
]);
console.log(record1, record2);

// List several records by key prefix - note that results are ordered
// lexicographically, so our players will be fetched in the order
// "alice", "briana", "carlos"
const records = kv.list({ prefix: ["players"] });
const players = [];
for await (const res of records) {
  players.push(res.value as Player);
}
console.log(players);

// Delete a value for a given key
await kv.delete(["players", "carlos"]);

// The Deno.KvU64 object is a wrapper for 64 bit integers (BigInt), so you can
// quickly update very large numbers. Let's add a "score" for alice.
const aliceScoreKey = ["scores", "alice"];
await kv.set(aliceScoreKey, new Deno.KvU64(0n));

// Add 10 to the player's score in an atomic transaction
const res = await kv.atomic()
  .check({ key: aliceScoreKey, versionstamp: null }) // Check if this key has been modified since we read it
  .mutate({
    type: "sum",
    key: aliceScoreKey,
    value: new Deno.KvU64(10n),
  })
  .commit();
// Check if the transaction was successful
if (res.ok) {
  const newScore = (await kv.get<Deno.KvU64>(aliceScoreKey)).value;
  console.log("Alice's new score is:", newScore);
} else {
  console.error("Transaction failed ");
  // Optionally, implement retry logic or handle the conflict
}

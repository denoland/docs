/**
 * @title Generate seeded random numbers
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://jsr.io/@std/random} @std/random on JSR
 * @resource {https://docs.deno.com/examples/secure_random_values/} Example: Generate secure random values
 * @group Standard library
 *
 * Math.random gives you no way to set a seed, so test runs and simulations
 * that need reproducible randomness cannot use it. The @std/random module
 * provides a seeded pseudo-random number generator (PCG32) plus helpers
 * for ranges, sampling, and shuffling that accept any generator. Do not
 * use seeded generators for security; for tokens and keys, see the secure
 * random values example.
 */
import {
  randomIntegerBetween,
  randomSeeded,
  sample,
  shuffle,
} from "jsr:@std/random";

// randomSeeded creates a generator from a bigint seed. It is a drop-in
// replacement for Math.random: a function returning floats in [0, 1).
const prng = randomSeeded(42n);

console.log(prng()); // 0.7916327826678753
console.log(prng()); // 0.7799280444160104

// The same seed always produces the same sequence, which is the point:
// a failing test that used seed 42 can be replayed exactly.
const replay = randomSeeded(42n);
console.log(replay()); // 0.7916327826678753

// The helpers take the generator through the prng option. Without it they
// fall back to Math.random.
console.log(randomIntegerBetween(1, 6, { prng })); // 1

// sample picks a random element, shuffle returns a new shuffled array.
const deck = ["ace", "king", "queen", "jack"];
console.log(sample(deck, { prng })); // jack
console.log(shuffle(deck, { prng })); // [ "ace", "queen", "jack", "king" ]

// For seeded bytes, getRandomValuesSeeded builds the seeded counterpart
// of crypto.getRandomValues: it takes a seed and returns a function that
// fills typed arrays.
import { getRandomValuesSeeded } from "jsr:@std/random";
const getRandomValues = getRandomValuesSeeded(42n);
console.log(getRandomValues(new Uint8Array(4)));

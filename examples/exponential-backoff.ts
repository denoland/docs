/**
 * @title Exponential backoff
 * @difficulty intermediate
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://en.wikipedia.org/wiki/Exponential_backoff} Wikipedia: Exponential backoff
 * @resource {https://jsr.io/@std/async/doc/~/retry} Doc: @std/async > retry
 * @group Advanced
 *
 * Exponential backoff is a technique used in computer systems to handle retries and
 * avoid overwhelming services. We can easily implement this by using the `retry`
 * utility provided by the standard library.
 */

// Import the 'retry' utility from '@std/async'.
import { retry, RetryError, type RetryOptions } from "jsr:@std/async";

// A function that will throw an error when called after logging 'hello world' in the
// console.
const fn = () => {
  console.log("hello world");
  return Promise.reject("rejected");
};

// Configuration for retry options which will make sure that the function will be
// called at max 3 times before throwing an error. The first call to the function
// will be made immediately, the second call will happen after a delay of 10ms
// and the third/final call will be made after a delay of 20ms.
const options: RetryOptions = {
  maxAttempts: 3,
  minTimeout: 10,
  multiplier: 2,
  jitter: 0,
};

try {
  // Wrap the function with the 'retry' utility along with the retry configuration.
  await retry(fn, options);
} catch (err) {
  // Error thrown by retry utility will be an instance of RetryError class from
  // '@std/async'.
  if (err instanceof RetryError) {
    console.log("Retry error :", err.message);
    console.log("Error cause :", err.cause);
  }
}

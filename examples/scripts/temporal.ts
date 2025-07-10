/**
 * @title Temporal API
 * @difficulty beginner
 * @tags cli
 * @run --unstable-temporal <url>
 * @resource {https://docs.deno.com/api/web/~/Temporal} Temporal API reference documentation
 * @resource {https://tc39.es/proposal-temporal/docs} Temporal API proposal documentation
 * @group Unstable APIs
 */

// Get the current date
const date = Temporal.Now.plainDateISO();

// Return the date in ISO 8601 date format (eg "2025-01-31")
const dateAsString = date.toString();
console.log(`Temporal date as string: ${dateAsString}`);

// Get current date and time in ISO 8601 format (eg "2025-01-31T10:51:40.269979904")
const plainDateTimeIsoString = Temporal.Now.plainDateTimeISO().toString();
console.log(`Temporal plainDateTimeISO as string: ${plainDateTimeIsoString}`);

// Get Unix timestamp (eg 2025-01-31T18:51:59.093355008Z)
const timeStamp = Temporal.Now.instant();
console.log(`Temporal timestamp as string: ${timeStamp}`);

// Return timestamp in milliseconds (eg 1738349519093)
const epochMilliseconds = timeStamp.epochMilliseconds;
console.log(`Temporal timestamp epoch milliseconds: ${epochMilliseconds}`);

// Get date and time in ISO 8601 format from milliseconds (eg "2025-01-31T18:51:59.093Z")
const futureTime = Temporal.Instant.fromEpochMilliseconds(1851222399924);
console.log(`Temporal future time: ${futureTime}`);

// Measure difference in hours from now.
const now = Temporal.Now.instant();
const differenceInHours = now.until(futureTime, { smallestUnit: "hour" });
console.log(`Temporal difference in hours: ${differenceInHours}`);

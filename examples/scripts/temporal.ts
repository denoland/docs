/**
 * @title Temporal API
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://docs.deno.com/api/web/~/Temporal} Temporal API reference documentation
 * @resource {https://tc39.es/proposal-temporal/docs} Temporal API proposal documentation
 * @group Unstable APIs
 */

// Get the current date
const date = Temporal.Now.plainDateISO(); // 2025-01-31

// Return the date in ISO 8601 date format
const dateAsString = date.toString(); // "2025-01-31"
console.log(`Temporal date as string: ${dateAsString}`);

// Get current date and time in ISO 8601 format
const plainDateTimeIsoString = Temporal.Now.plainDateTimeISO().toString(); // "2025-01-31T10:51:40.269979904"
console.log(`Temporal plainDateTimeISO as string: ${plainDateTimeIsoString}`);

// Get Unix timestamp
const timeStamp = Temporal.Now.instant(); // 2025-01-31T18:51:59.093355008Z
console.log(`Temporal timestamp as string: ${timeStamp}`);

// Return timestamp in milliseconds
const epochMilliseconds = timeStamp.epochMilliseconds; // 1738349519093
console.log(`Temporal timestamp epoch milliseconds: ${epochMilliseconds}`);

// Get date and time in ISO 8601 format from milliseconds
const futureTime = Temporal.Instant.fromEpochMilliseconds(1851222399924); // 2028-08-30T04:26:39.924Z
console.log(`Temporal future time: ${futureTime}`);

// Measure difference in hours from now.
const now = Temporal.Now.instant();
const differenceInHours = now.until(futureTime, { smallestUnit: "hour" }); // PT31600H
console.log(`Temporal difference in hours: ${differenceInHours}`);

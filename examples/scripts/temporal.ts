/**
 * @title Temporal API
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://tc39.es/proposal-temporal/docs} Temporal API proposal documentation
 * @group Unstable APIs
 */

// Get the current date
const date = Temporal.Now.plainDateISO(); // 2025-01-31

// Return the date in ISO 8601 date format
date.toString(); // "2025-01-31"

// Get current date and time in ISO 8601 format
Temporal.Now.plainDateTimeISO().toString(); // "2025-01-31T10:51:40.269979904"

// Get Unix timestamp
const timeStamp = Temporal.Now.instant(); // 2025-01-31T18:51:59.093355008Z

// Return timestamp in milliseconds
timeStamp.epochMilliseconds; // 1738349519093

// Get date and time in ISO 8601 format from milliseconds
const futureTime = Temporal.Instant.fromEpochMilliseconds(1851222399924); // 2028-08-30T04:26:39.924Z

// Measure difference in hours from now.
const now = Temporal.Now.instant();
now.until(futureTime, { smallestUnit: "hour" }); // PT31600H

/**
 * @title Parse large CSV files as streams
 * @difficulty beginner
 * @tags cli, deploy
 * @run -R -W <url>
 * @resource {https://jsr.io/@std/csv/doc/~/CsvParseStream} Doc: CsvParseStream
 * @resource {/examples/parsing_serializing_csv/} Example: Parsing and serializing CSV
 * @group Encoding
 *
 * Reading a whole CSV file into memory does not work once the file grows to
 * gigabytes. CsvParseStream from jsr:@std/csv parses records as the bytes
 * arrive, so only one record is in memory at a time. For small files the
 * in-memory parse function shown in /examples/parsing_serializing_csv/ is
 * simpler.
 */
import { CsvParseStream } from "jsr:@std/csv";

// We create a small sample file. In a real application this could be a
// multi-gigabyte export.
const dir = await Deno.makeTempDir();
const path = `${dir}/measurements.csv`;
await Deno.writeTextFile(
  path,
  `city,temperature,humidity
Berlin,18.5,60
Madrid,24.1,35
Oslo,11.2,72
`,
);

// Open the file and build a pipeline. The raw bytes pass through a
// TextDecoderStream to become text, then through a CsvParseStream to
// become records. With skipFirstRow the header line names the fields and
// every record is an object.
const file = await Deno.open(path);
const records = file.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new CsvParseStream({ skipFirstRow: true }));

// Iterate with for await. The pipeline pulls from the file on demand and
// closes it when the iteration ends. Every field value is a string.
for await (const record of records) {
  console.log(record.city, record.temperature);
}
//- Berlin 18.5
//- Madrid 24.1
//- Oslo 11.2

// Files without a header line work too. The columns option supplies the
// field names and also types the records, so record.city is checked by the
// TypeScript compiler.
const headerless = `${dir}/headerless.csv`;
await Deno.writeTextFile(headerless, `Berlin,18.5,60\nMadrid,24.1,35\n`);
const file2 = await Deno.open(headerless);
const rows = file2.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(
    new CsvParseStream({ columns: ["city", "temperature", "humidity"] }),
  );
for await (const row of rows) {
  console.log(row);
}
//- { city: "Berlin", temperature: "18.5", humidity: "60" }
//- { city: "Madrid", temperature: "24.1", humidity: "35" }

// Reading and writing files requires the -R and -W permissions.
await Deno.remove(dir, { recursive: true });

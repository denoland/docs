/**
 * @title Create and extract tar archives
 * @difficulty beginner
 * @tags cli, deploy
 * @run -R -W <url>
 * @resource {https://jsr.io/@std/tar} Doc: @std/tar
 * @resource {/examples/compress_decompress/} Example: Compress and decompress data
 * @group File System
 *
 * A tar archive bundles many files and directories into a single file,
 * usually compressed with gzip to produce the familiar .tar.gz format.
 * The Standard Library provides TarStream and UntarStream in jsr:@std/tar,
 * both built on web standard streams so they compose with CompressionStream
 * and file streams without buffering whole archives in memory.
 */
import { TarStream, type TarStreamInput, UntarStream } from "jsr:@std/tar";
import { normalize } from "jsr:@std/path";

// We prepare a directory with two files to archive.
const dir = await Deno.makeTempDir();
await Deno.mkdir(`${dir}/project`);
await Deno.writeTextFile(`${dir}/project/readme.txt`, "A sample project.");
await Deno.writeTextFile(`${dir}/project/config.json`, `{"name":"sample"}`);

// To create an archive, pipe a stream of entries through a TarStream.
// A directory entry only needs a path. A file entry also needs its size
// and a readable stream of its contents. Piping the result through a
// CompressionStream produces a .tar.gz file.
const readmeStat = await Deno.stat(`${dir}/project/readme.txt`);
const configStat = await Deno.stat(`${dir}/project/config.json`);
const archive = await Deno.create(`${dir}/project.tar.gz`);
const inputs: TarStreamInput[] = [
  { type: "directory", path: "project" },
  {
    type: "file",
    path: "project/readme.txt",
    size: readmeStat.size,
    readable: (await Deno.open(`${dir}/project/readme.txt`)).readable,
  },
  {
    type: "file",
    path: "project/config.json",
    size: configStat.size,
    readable: (await Deno.open(`${dir}/project/config.json`)).readable,
  },
];
await ReadableStream.from(inputs)
  .pipeThrough(new TarStream())
  .pipeThrough(new CompressionStream("gzip"))
  .pipeTo(archive.writable);

console.log((await Deno.stat(`${dir}/project.tar.gz`)).size); // 258

// To extract, run the pipeline in reverse: decompress the bytes, then
// pipe them through an UntarStream and iterate over the entries.
const outDir = `${dir}/extracted`;
await Deno.mkdir(outDir);
const tarball = await Deno.open(`${dir}/project.tar.gz`);
const entries = tarball.readable
  .pipeThrough(new DecompressionStream("gzip"))
  .pipeThrough(new UntarStream());

// Directory entries have no readable stream. For file entries, piping the
// readable into a file writes it to disk. Paths inside an archive are not
// trustworthy, so normalize them before touching the file system.
for await (const entry of entries) {
  console.log(entry.path);
  const target = `${outDir}/${normalize(entry.path)}`;
  if (entry.readable === undefined) {
    await Deno.mkdir(target, { recursive: true });
    continue;
  }
  const file = await Deno.create(target);
  await entry.readable.pipeTo(file.writable);
}
//- project
//- project/readme.txt
//- project/config.json

// The extracted files match the originals.
console.log(await Deno.readTextFile(`${outDir}/project/readme.txt`)); // A sample project.
console.log(await Deno.readTextFile(`${outDir}/project/config.json`)); // {"name":"sample"}

// Reading and writing files requires the -R and -W permissions.
await Deno.remove(dir, { recursive: true });

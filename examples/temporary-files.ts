/**
 * @title Temporary Files & Directories
 * @difficulty beginner
 * @tags cli
 * @run --allow-read --allow-write <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.makeTempFile} Doc: Deno.makeTempFile
 * @resource {https://docs.deno.com/api/deno/~/Deno.makeTempDir} Doc: Deno.makeTempDir
 * @group File System
 *
 * Temporary files and directories are used to store data that is not intended
 * to be permanent. For example, as a local cache of downloaded data.
 */

// The `Deno.makeTempFile()` function creates a temporary file in the default
// temporary directory and returns the path to the file.
const tempFilePath = await Deno.makeTempFile();
console.log("Temp file path:", tempFilePath);
await Deno.writeTextFile(tempFilePath, "Hello world!");
const data = await Deno.readTextFile(tempFilePath);
console.log("Temp file data:", data);

// A custom prefix and suffix for the temporary file can be specified.
const tempFilePath2 = await Deno.makeTempFile({
  prefix: "logs_",
  suffix: ".txt",
});
console.log("Temp file path 2:", tempFilePath2);

// The directory that temporary files are created in can be customized too.
// Here we use a relative ./tmp directory.
await Deno.mkdir("./tmp", { recursive: true });
const tempFilePath3 = await Deno.makeTempFile({
  dir: "./tmp",
});
console.log("Temp file path 3:", tempFilePath3);

// A temporary directory can also be created.
const tempDirPath = await Deno.makeTempDir();
console.log("Temp dir path:", tempDirPath);

// It has the same prefix, suffix, and directory options as `makeTempFile()`.
const tempDirPath2 = await Deno.makeTempDir({
  prefix: "logs_",
  suffix: "_folder",
  dir: "./tmp",
});
console.log("Temp dir path 2:", tempDirPath2);

// Synchronous versions of the above functions are also available.
const tempFilePath4 = Deno.makeTempFileSync();
const tempDirPath3 = Deno.makeTempDirSync();
console.log("Temp file path 4:", tempFilePath4);
console.log("Temp dir path 3:", tempDirPath3);

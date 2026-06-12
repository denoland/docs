/**
 * @title Structured logging
 * @difficulty beginner
 * @tags cli, deploy
 * @run -R -W <url>
 * @resource {https://jsr.io/@std/log} Doc: @std/log
 * @resource {https://jsr.io/@std/log/doc/~/FileHandler} Doc: @std/log FileHandler
 * @group Standard library
 *
 * The @std/log package routes log records through configurable handlers
 * with severity levels. This example sends INFO and above to the
 * console, writes WARN and above to a file as JSON lines, and shows
 * that records below a handler level are filtered out.
 */

import * as log from "jsr:@std/log";

const logFile = "/tmp/structured_logging_example.log";

// A handler decides where records go and which levels it accepts. The
// formatter option customizes the output line, here as JSON without
// timestamps to keep the example deterministic.
const fileHandler = new log.FileHandler("WARN", {
  filename: logFile,
  formatter: (record) =>
    JSON.stringify({ level: record.levelName, message: record.msg }),
});

// Setup wires handlers to the default logger. The console handler only
// accepts INFO and above, and useColors false keeps the output plain.
log.setup({
  handlers: {
    console: new log.ConsoleHandler("INFO", { useColors: false }),
    file: fileHandler,
  },
  loggers: {
    default: { level: "DEBUG", handlers: ["console", "file"] },
  },
});

// This record is below INFO, so neither handler prints or stores it.
log.debug("cache miss for key user:42");

// INFO reaches the console handler but not the WARN file handler.
log.info("server listening on port 8000"); // INFO server listening on port 8000

// WARN and ERROR reach both handlers.
log.warn("disk usage at 81%"); // WARN disk usage at 81%
log.error("upstream timed out"); // ERROR upstream timed out

// The file handler buffers writes, so flush before reading the file.
fileHandler.flush();

const contents = await Deno.readTextFile(logFile);
console.log(contents.trimEnd()); // {"level":"WARN","message":"disk usage at 81%"}
// {"level":"ERROR","message":"upstream timed out"}

// Close the handler and remove the file to clean up.
fileHandler.destroy();
await Deno.remove(logFile);

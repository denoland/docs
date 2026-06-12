/**
 * @title Find an executable on the PATH
 * @difficulty beginner
 * @tags cli
 * @run -R -E <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.env} Doc: Deno.env
 * @resource {https://docs.deno.com/api/deno/~/Deno.Command} Doc: Deno.Command
 * @group System
 *
 * Before spawning a tool like git or ffmpeg, it is useful to know whether
 * it is installed and where. This example implements the which command:
 * scan each directory on the PATH for an executable file.
 */

async function which(command: string): Promise<string | null> {
  const PATH = Deno.env.get("PATH") ?? "";
  // Windows separates entries with ";" and resolves extensions from
  // PATHEXT; this example covers the common case.
  const separator = Deno.build.os === "windows" ? ";" : ":";

  for (const dir of PATH.split(separator)) {
    if (dir === "") continue;
    const candidate = `${dir}/${command}`;
    try {
      const info = await Deno.stat(candidate);
      // On unix, check that some execute bit is set. Windows has no mode,
      // so existence is the best cheap signal.
      const executable = Deno.build.os === "windows" ||
        ((info.mode ?? 0) & 0o111) !== 0;
      if (info.isFile && executable) {
        return candidate;
      }
    } catch {
      // Not in this directory; keep looking.
    }
  }
  return null;
}

console.log(await which("git")); // /usr/bin/git
console.log(await which("definitely-not-installed")); // null

// A typical use is a friendly error before spawning a subprocess.
const ffmpeg = await which("ffmpeg");
if (!ffmpeg) {
  console.log("ffmpeg is required: https://ffmpeg.org/download.html");
}

// Reading the PATH requires -E, and stat-ing the candidates requires -R.

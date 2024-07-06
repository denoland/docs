import { walkSync } from "@std/fs/walk";

export const layout = "raw.tsx";

export default function* () {
  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      throw new Error();
    }
    const files = walkSync("reference_gen/gen", {
      exts: [".html"],
    });

    for (const file of files) {
      const content = Deno.readTextFileSync(file.path).replace(
        /<link id="ddocResetStylesheet" rel="stylesheet" href=".*?reset\.css">\s+/,
        "",
      );

      const trailingLength = file.path.endsWith("index.html")
              ? -"index.html".length
              : -".html".length;

      let path = file.path.slice("reference_gen/gen".length, trailingLength);

      // replace slashes for windows
      path = path.replace(/\\/g, "/");

      yield {
        url: "/api" + path,
        title: file.name.slice(0, -".html".length),
        content,
      };
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }
}

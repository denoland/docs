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

      yield {
        url: "/api" +
          file.path.slice(
            "reference_gen/gen".length,
            file.path.endsWith("index.html")
              ? -"index.html".length
              : -".html".length,
          ),
        title: file.name.slice(0, -".html".length),
        content,
      };
    }
  } catch {
    console.warn("⚠️ Reference docs were not generated.");
  }
}

import { walkSync } from "@std/fs/walk";

export const layout = "raw.tsx";

export default function* () {
  try {
    const files = walkSync("reference_gen/gen", {
      exts: [".html"],
    });

    for (const file of files) {
      const content = Deno.readTextFileSync(file.path);

      yield {
        url: "/api" + file.path.slice("reference_gen/gen".length, -".html".length),
        title: file.name.slice(0, -".html".length),
        content,
      };
    }
  } catch (e) {
    console.warn("⚠️ Reference docs were not generated.");
  }
}

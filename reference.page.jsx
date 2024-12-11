import { walkSync } from "@std/fs/walk";
import { unescape } from "@std/html/entities";
import entityList from "@std/html/named-entity-list.json" with { type: "json" };

export const layout = "raw.tsx";

export const sidebar = [];


const resetRegexp =
  /<link id="ddocResetStylesheet" rel="stylesheet" href=".*?reset\.css">\s*/;
const titleRegexp = /<title>(.+?)<\/title>\s*/s;

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
        resetRegexp,
        "",
      );

      let title = "";
      try {
        const match = titleRegexp.exec(content);
        const titleFirst = match[1].slice(0, -"documentation".length);

        title = unescape(titleFirst, { entityList }) + "- Deno Docs";
      } catch (e) {
        if (!file.path.endsWith("prototype.html")) {
          console.error(file.path);
          throw e;
        }
      }

      const trailingLength = file.path.endsWith("index.html")
        ? -"index.html".length
        : -".html".length;

      let path = file.path.slice("reference_gen/gen".length, trailingLength);

      // replace slashes for windows
      path = path.replace(/\\/g, "/");

      yield {
        url: "/api" + path,
        title,
        content,
      };
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }
}

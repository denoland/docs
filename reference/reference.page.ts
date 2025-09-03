import type { Page } from "@deno/doc";

export const layout = "raw.tsx";

export const sidebar = [
  {
    items: [
      {
        label: "Deno APIs",
        id: "/api/deno/",
      },
      {
        label: "Web APIs",
        id: "/api/web/",
      },
      {
        label: "Node APIs",
        id: "/api/node/",
      },
    ],
  },
];

const kinds = [
  { path: "reference_gen/gen/deno.json", name: "Deno" },
  { path: "reference_gen/gen/web.json", name: "Web" },
  { path: "reference_gen/gen/node.json", name: "Node" },
] as const;

export default function* () {
  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      console.warn("⏭️ Reference docs generation skipped (SKIP_REFERENCE set)");
      return;
    }

    for (const { path, name } of kinds) {
      console.log(`📖 Loading ${name} reference docs from ${path}...`);

      let json: Record<string, Page>;
      try {
        const fileContent = Deno.readTextFileSync(path);
        json = JSON.parse(fileContent);
        console.log(
          `✅ Successfully loaded ${name} reference docs (${
            Object.keys(json).length
          } entries)`,
        );
      } catch (readError) {
        console.error(`❌ Failed to read ${path}:`, readError);
        console.error(`   Current working directory: ${Deno.cwd()}`);

        // Check if the file exists
        try {
          const stat = Deno.statSync(path);
          console.error(
            `   File exists but read failed. Size: ${stat.size} bytes`,
          );
        } catch {
          console.error(`   File does not exist at: ${path}`);

          // Check if the gen directory exists
          try {
            Deno.statSync("reference_gen/gen");
            console.error(`   Gen directory exists, contents:`);
            for (const entry of Deno.readDirSync("reference_gen/gen")) {
              console.error(
                `     - ${entry.name} (${entry.isFile ? "file" : "dir"})`,
              );
            }
          } catch {
            console.error(
              `   Gen directory does not exist at reference_gen/gen`,
            );
            console.error(
              `   Run 'deno task generate:reference' to generate the reference docs`,
            );
          }
        }
        throw readError;
      }
      for (
        const [filepath, content] of Object.entries(json)
      ) {
        if (content.kind === "search") {
          continue;
        }

        const trailingLength = filepath.endsWith("index.json")
          ? -"index.json".length
          : -".json".length;

        const url = `/api/${name.toLowerCase()}/${
          filepath.slice(0, trailingLength)
        }`;

        if ("path" in content) {
          // TODO: handle redirects in a more integrated manner

          yield {
            url,
            content:
              `<meta http-equiv="refresh" content="0; url=${content.path}">`,
          };

          continue;
        }

        let layout;
        if (content.kind === "IndexCtx") {
          layout = "index";
        } else if (content.kind === "AllSymbolsCtx") {
          layout = "allSymbols";
        } else if (content.kind === "SymbolPageCtx") {
          layout = "symbol";
        } else {
          throw `unknown page kind: ${content.kind}`;
        }

        yield {
          url,
          title: content.html_head_ctx.title,
          layout: `reference/${layout}.tsx`,
          pageContent: content,
          data: content,
        };
      }
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }
}

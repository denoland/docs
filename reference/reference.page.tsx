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
      throw new Error();
    }

    for (const { path, name } of kinds) {
      const json = JSON.parse(Deno.readTextFileSync(path));

      for (
        const [filepath, content] of Object.entries(
          json as Record<string, Page>,
        )
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

        (content as Page & { url: string }).url = url;

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
          data: content,
        };
      }
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }
}

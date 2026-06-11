import type { Page } from "@deno/doc";
import { type ApiKind, buildReference, type Group } from "./_lib/group.ts";
import denoCategories from "../reference_gen/deno-categories.json" with {
  type: "json",
};
import webCategories from "../reference_gen/web-categories.json" with {
  type: "json",
};

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

const kinds: { path: string; kind: ApiKind; title: string }[] = [
  { path: "reference_gen/gen/deno.json", kind: "deno", title: "Deno" },
  { path: "reference_gen/gen/web.json", kind: "web", title: "Web" },
  { path: "reference_gen/gen/node.json", kind: "node", title: "Node" },
];

export default function* () {
  if (Deno.env.get("SKIP_REFERENCE") === "1") {
    console.warn("⏭️ Reference docs generation skipped (SKIP_REFERENCE set)");
    return;
  }

  const jsons = {} as Record<ApiKind, Record<string, Page>>;
  try {
    for (const { path, kind } of kinds) {
      console.log(`📖 Loading ${kind} reference docs from ${path}...`);
      jsons[kind] = JSON.parse(Deno.readTextFileSync(path));
      console.log(
        `✅ Loaded ${kind} reference docs (${
          Object.keys(jsons[kind]).length
        } entries)`,
      );
    }
  } catch (ex) {
    console.warn(
      "⚠️ Reference docs were not generated. Run 'deno task generate:reference' first.",
      ex,
    );
    return;
  }

  const { groups, redirects, warnings, rewritePage } = buildReference(jsons, {
    deno: denoCategories,
    web: webCategories,
  });

  if (warnings.length > 0) {
    const logPath = "reference_gen/gen/reference-warnings.log";
    Deno.writeTextFileSync(logPath, warnings.join("\n") + "\n");
    console.warn(
      `⚠️ ${warnings.length} reference link warnings (dead links in source docs). Full list: ${logPath}`,
    );
  }

  for (const { kind, title } of kinds) {
    for (const group of groups[kind]) {
      yield {
        url: group.url,
        title: `${group.title} - ${title} documentation`,
        description: descriptionFor(group),
        layout: "reference/multiSymbol.tsx",
        data: {
          ...group,
          toc_ctx: {
            usages: null,
            top_symbols: null,
            document_navigation_str: null,
            document_navigation: group.toc,
          },
        },
      };
    }

    // The "view all symbols" page, with links rewritten to the new URLs.
    for (const [filepath, content] of Object.entries(jsons[kind])) {
      if (content.kind !== "AllSymbolsCtx") continue;
      const normalized = filepath.replace(/^\.\//, "").replace(/\.json$/, "");
      yield {
        url: `/api/${kind}/${normalized}`,
        title: `All Symbols - ${title} documentation`,
        layout: "reference/allSymbols.tsx",
        data: rewritePage(kind, filepath, content),
      };
    }
  }

  // Landing page per API kind: a dense Ctrl+F-able index of every symbol.
  // The hand-written guides that previously lived at these URLs moved to
  // /api/<kind>/about/ (see api/*/index.md).
  const kindMeta = {
    deno: {
      title: "Deno APIs",
      intro:
        "Every API in the global Deno namespace, by category. Use your browser's find-in-page to locate a symbol, then click through for full documentation.",
      aboutLabel: "About the Deno namespace",
    },
    web: {
      title: "Web APIs",
      intro:
        "Every web platform API implemented by Deno, by category. Use your browser's find-in-page to locate a symbol, then click through for full documentation.",
      aboutLabel: "About web platform support",
    },
    node: {
      title: "Node APIs",
      intro:
        "Every Node.js built-in module supported by Deno and its exports. Use your browser's find-in-page to locate a symbol, then click through for full documentation.",
      aboutLabel: "About Node.js compatibility",
    },
  } as const;

  for (const { kind } of kinds) {
    const meta = kindMeta[kind];
    yield {
      url: `/api/${kind}/`,
      title: `${meta.title} reference`,
      description: meta.intro,
      fullWidth: true,
      layout: "reference/apiIndex.tsx",
      data: {
        title: meta.title,
        intro: meta.intro,
        aboutUrl: `/api/${kind}/about/`,
        aboutLabel: meta.aboutLabel,
        allSymbolsUrl: `/api/${kind}/all_symbols`,
        groups: groups[kind].map((group) => ({
          title: group.title === "Uncategorized" ? "Other APIs" : (
            kind === "node" ? `node:${group.slug}` : group.title
          ),
          url: group.url,
          slug: group.slug.replace(/\//g, "-"),
          group,
        })),
      },
    };
  }

  // The /api/ hub: tile grids for every API group, derived from the same
  // grouping data as the pages themselves.
  yield {
    url: "/api/",
    title: "API reference",
    description:
      "Complete API reference for Deno: built-in Deno APIs, supported Web APIs, and Node.js compatibility modules.",
    fullWidth: true,
    layout: "reference/landing.tsx",
    data: {
      intro:
        "The complete API reference for Deno: runtime APIs available in the Deno namespace, supported web platform APIs, and the Node.js built-in modules Deno provides for compatibility.",
      sections: [
        {
          key: "deno",
          title: "Deno APIs",
          description:
            "Non-standard APIs in the global Deno namespace: file system, network, subprocesses, testing, FFI, and more.",
          href: "/api/deno/",
          allSymbolsHref: "/api/deno/all_symbols",
          tiles: categoryTiles(groups.deno),
        },
        {
          key: "web",
          title: "Web APIs",
          description:
            "Web platform standards implemented by Deno: fetch, streams, workers, crypto, and other browser-compatible APIs.",
          href: "/api/web/",
          allSymbolsHref: "/api/web/all_symbols",
          tiles: categoryTiles(groups.web),
        },
        {
          key: "node",
          title: "Node APIs",
          description:
            "Node.js built-in modules supported in Deno for backwards compatibility, importable via the node: scheme.",
          href: "/api/node/",
          allSymbolsHref: "/api/node/all_symbols",
          tiles: groups.node
            .map((group) => ({
              title: `node:${group.slug}`,
              href: group.url,
              description: tileDescription(group.docs),
            }))
            .sort((a, b) => a.title.localeCompare(b.title)),
          dense: true,
        },
      ],
    },
  };

  console.log(
    `📚 Reference pages: ${
      Object.values(groups).reduce((a, g) => a + g.length, 0)
    } grouped pages, ${Object.keys(redirects).length} redirects`,
  );

  // Consumed by middleware/redirects.ts to 301 old per-symbol URLs to their
  // anchor on the grouped pages.
  yield {
    url: "/api/_redirects.json",
    content: JSON.stringify(redirects),
  };
}

/** First sentence of a rendered HTML docs block, as plain text. */
function tileDescription(docs: string | null): string | null {
  if (!docs) return null;
  const text = docs.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length === 0) return null;
  const sentence = text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
  return sentence.length > 140 ? sentence.slice(0, 137) + "..." : sentence;
}

function categoryTiles(groups: Group[]) {
  return groups
    .map((group) => ({
      // The generated catch-all category reads poorly on a landing page.
      title: group.title === "Uncategorized" ? "Other APIs" : group.title,
      href: group.url,
      description: tileDescription(group.docs),
    }))
    .sort((a, b) =>
      (a.title === "Other APIs" ? 1 : 0) - (b.title === "Other APIs" ? 1 : 0) ||
      a.title.localeCompare(b.title)
    );
}

function descriptionFor(group: Group): string {
  const fallbacks: Record<ApiKind, string> = {
    deno: `API reference for Deno's built-in ${group.title} APIs.`,
    web: `API reference for the ${group.title} Web APIs available in Deno.`,
    node: `API reference for the node:${group.slug} module in Deno.`,
  };
  const fallback = fallbacks[group.apiKind];
  if (!group.docs) return fallback;
  const text = group.docs.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length === 0) return fallback;
  return text.length > 160 ? text.slice(0, 157) + "..." : text;
}

// Test fixtures populate loosely-typed subsets of @deno/doc's Page shapes.
// deno-lint-ignore-file no-explicit-any
import { assertEquals, assertExists, assertMatch } from "@std/assert";
import type { Page } from "@deno/doc";
import { type ApiKind, buildReference } from "./group.ts";

// buildReference consumes a small, well-defined subset of @deno/doc's Page
// shapes. These builders populate just those fields and cast through unknown,
// so the fixtures stay readable and document exactly what the grouper reads.

function indexPage(opts: {
  title: string;
  section?: string;
  roots: string[];
  docs?: string | null;
}): any {
  return {
    kind: "IndexCtx",
    overview: {
      docs: opts.docs ?? null,
      sections: [{
        header: {
          title: opts.section ?? "Classes",
          anchor: { id: (opts.section ?? "Classes").toLowerCase() },
        },
        content: {
          kind: "namespace_section",
          content: opts.roots.map((name) => ({
            name,
            doc_node_kind_ctx: [{ kind: "Class" }],
          })),
        },
      }],
    },
    breadcrumbs_ctx: { parts: [{ name: opts.title }] },
    usage: null,
  };
}

function symbolPage(symbolGroup: unknown): any {
  return { kind: "SymbolPageCtx", symbol_group_ctx: symbolGroup };
}

function build(jsons: Record<ApiKind, Record<string, unknown>>) {
  return buildReference(jsons as Record<ApiKind, Record<string, Page>>);
}

const empty = () => ({ deno: {}, web: {}, node: {} });

Deno.test("groups a category and builds its URL and title", () => {
  const { groups } = build({
    ...empty(),
    deno: {
      "./file-system.json": indexPage({
        title: "File system",
        roots: ["Deno.FsFile"],
      }),
      "./~/Deno.FsFile.json": symbolPage({ content: [] }),
    },
  });

  assertEquals(groups.deno.length, 1);
  const group = groups.deno[0];
  assertEquals(group.url, "/api/deno/file-system/");
  assertEquals(group.slug, "file-system");
  assertEquals(group.title, "File system");
  assertEquals(group.symbols.map((s) => s.name), ["Deno.FsFile"]);
});

Deno.test("redirects collapse a symbol and its properties to the parent anchor", () => {
  const { redirects } = build({
    ...empty(),
    deno: {
      "./file-system.json": indexPage({
        title: "File system",
        roots: ["Deno.FsFile"],
      }),
      "./~/Deno.FsFile.json": symbolPage({ content: [] }),
      // A property page must redirect to the parent symbol's anchor.
      "./~/Deno.FsFile.close.json": symbolPage({ content: [] }),
    },
  });

  assertEquals(
    redirects["/api/deno/~/Deno.FsFile"],
    "/api/deno/file-system/#Deno.FsFile",
  );
  assertEquals(
    redirects["/api/deno/~/Deno.FsFile.close"],
    "/api/deno/file-system/#Deno.FsFile",
  );
});

Deno.test("namespaces in-page anchors with the root symbol name", () => {
  const { groups } = build({
    ...empty(),
    deno: {
      "./file-system.json": indexPage({
        title: "File system",
        roots: ["Deno.FsFile"],
      }),
      "./~/Deno.FsFile.json": symbolPage({
        members: [{ id: "method_close_0", name_href: "#method_close_0" }],
      }),
    },
  });

  const member = (groups.deno[0].symbols[0].symbolGroup as any).members[0];
  assertEquals(member.id, "Deno.FsFile.method_close_0");
  assertEquals(member.name_href, "#Deno.FsFile.method_close_0");
});

Deno.test("rewrites a cross-symbol link to the new anchored URL", () => {
  const { groups } = build({
    ...empty(),
    deno: {
      "./file-system.json": indexPage({
        title: "File system",
        roots: ["Deno.FsFile"],
      }),
      "./io.json": indexPage({ title: "I/O", roots: ["Deno.Buffer"] }),
      "./~/Deno.Buffer.json": symbolPage({ content: [] }),
      "./~/Deno.FsFile.json": symbolPage({
        body: `See <a href="../~/Deno.Buffer">Buffer</a>.`,
      }),
    },
  });

  const fsFile = groups.deno.find((g) => g.slug === "file-system")!;
  const body = (fsFile.symbols[0].symbolGroup as any).body;
  assertMatch(body, /href="\/api\/deno\/io\/#Deno\.Buffer"/);
});

Deno.test("resolves cross-API-kind links (node -> web)", () => {
  const { groups } = build({
    deno: {},
    web: {
      "./streams.json": indexPage({ title: "Streams", roots: ["Blob"] }),
      "./~/Blob.json": symbolPage({ content: [] }),
    },
    node: {
      // Node symbol-page keys are module-relative with no "./" prefix.
      "buffer/index.json": indexPage({
        title: "buffer",
        roots: ["Buffer"],
      }),
      "buffer/~/Buffer.json": symbolPage({
        body: `Backed by <a href="/api/web/~/Blob">Blob</a>.`,
      }),
    },
  });

  const body = (groups.node[0].symbols[0].symbolGroup as any).body;
  assertMatch(body, /href="\/api\/web\/streams\/#Blob"/);
});

Deno.test("orders categories alphabetically with Uncategorized last", () => {
  const { groups } = build({
    ...empty(),
    deno: {
      "./network.json": indexPage({ title: "Network", roots: ["Deno.Conn"] }),
      "./~/Deno.Conn.json": symbolPage({ content: [] }),
      "./uncategorized.json": indexPage({
        title: "Uncategorized",
        roots: ["Deno.misc"],
      }),
      "./~/Deno.misc.json": symbolPage({ content: [] }),
      "./bundler.json": indexPage({ title: "Bundler", roots: ["Deno.bundle"] }),
      "./~/Deno.bundle.json": symbolPage({ content: [] }),
    },
  });

  assertEquals(
    groups.deno.map((g) => g.title),
    ["Bundler", "Network", "Uncategorized"],
  );
});

Deno.test("reports an unresolvable symbol link as a warning", () => {
  const { warnings } = build({
    ...empty(),
    deno: {
      "./file-system.json": indexPage({
        title: "File system",
        roots: ["Deno.FsFile"],
      }),
      "./~/Deno.FsFile.json": symbolPage({
        body: `Broken <a href="../~/Deno.DoesNotExist">link</a>.`,
      }),
    },
  });

  const dead = warnings.find((w) => w.includes("Deno.DoesNotExist"));
  assertExists(dead);
  assertMatch(dead!, /dead symbol link/);
});

/**
 * Groups the per-symbol output of @deno/doc's generateHtmlAsJSON into one
 * page per category (Deno, Web) or module (Node), so the site ships ~100
 * reference pages instead of ~11,000.
 *
 * Responsibilities:
 * - extract the top-level ("root") symbols of every category/module from its
 *   IndexCtx entry,
 * - attach each root's full SymbolPageCtx documentation to the group,
 * - namespace all in-page anchors with the root symbol name so symbols can
 *   share a page without id collisions,
 * - rewrite cross-symbol links ("../~/Deno.FsFile#method_close_0") to the
 *   new "<group-url>#Deno.FsFile.method_close_0" form,
 * - produce a redirect map for every old per-symbol URL.
 *
 * Resolution is global across the three API kinds because @deno/doc emits
 * cross-kind links (e.g. node:buffer's Blob redirects to /api/web/~/Blob).
 */

import type {
  DocNodeKindCtx,
  IndexCtx,
  NamespaceNodeCtx,
  Page,
  SymbolGroupCtx,
  SymbolPageCtx,
  ToCEntry,
} from "@deno/doc";

export type ApiKind = "deno" | "web" | "node";

export interface GroupSection {
  title: string;
  anchor: string;
  nodes: NamespaceNodeCtx[];
}

export interface GroupSymbol {
  name: string;
  anchor: string;
  kinds: DocNodeKindCtx[];
  symbolGroup: SymbolGroupCtx;
}

export interface Group {
  apiKind: ApiKind;
  slug: string;
  url: string;
  title: string;
  /** Rendered HTML docs for the category/module itself, if any. */
  docs: string | null;
  /** Usage block (import statement) - present for Node modules. */
  usage: IndexCtx["usage"];
  breadcrumbs: IndexCtx["breadcrumbs_ctx"];
  /** Symbol listing grouped by kind (Classes, Functions, ...). */
  sections: GroupSection[];
  /** Full documentation for every root symbol, in section order. */
  symbols: GroupSymbol[];
  toc: ToCEntry[];
}

export interface ReferenceResult {
  groups: Record<ApiKind, Group[]>;
  /** old pathname -> new pathname#anchor */
  redirects: Record<string, string>;
  warnings: string[];
  /** Rewrites symbol links in an arbitrary page ctx (e.g. AllSymbolsCtx)
   * using the global resolver, without anchor prefixing. */
  // deno-lint-ignore no-explicit-any
  rewritePage: (apiKind: ApiKind, filepath: string, value: any) => any;
}

interface RootInfo {
  name: string;
  groupUrl: string;
}

/** "deno" | "web" | "node" + module dir ("", "fs", "fs/promises") + name. */
function rootKey(kind: ApiKind, module: string, name: string): string {
  return `${kind}${module}${name}`;
}

function slugToTitle(slug: string): string {
  if (slug === "io") return "I/O";
  return slug.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
}

function groupUrl(apiKind: ApiKind, slug: string): string {
  return `/api/${apiKind}/${slug}/`;
}

/** Old-site URL of a JSON entry, mirroring the previous one-page-per-symbol
 * routing in reference.page.ts. */
function oldUrl(apiKind: ApiKind, filepath: string): string {
  const trailingLength = filepath.endsWith("index.json")
    ? -"index.json".length
    : -".json".length;
  let normalized = filepath.slice(0, trailingLength);
  if (normalized.startsWith("./")) {
    normalized = normalized.slice(2);
  }
  return `/api/${apiKind}/${normalized}`;
}

/** Directory of a JSON entry, used to resolve its relative links.
 * "./~/Deno.FsFile.json" -> "~", "fs/promises/~/x.json" -> "fs/promises/~" */
function dirOf(filepath: string): string {
  const normalized = filepath.replace(/^\.\//, "");
  const idx = normalized.lastIndexOf("/");
  return idx === -1 ? "" : normalized.slice(0, idx);
}

/** Resolves a relative href against a directory, posix style, clamped at the
 * root. Returns normalized segments joined with "/". */
function resolveRelative(dir: string, relative: string): string {
  const out = dir === "" ? [] : dir.split("/");
  for (const segment of relative.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      out.pop();
    } else {
      out.push(segment);
    }
  }
  return out.join("/");
}

/** Splits a normalized symbol path "fs/promises/~/FileHandle" into its
 * module dir and symbol name. Returns null if it is not a symbol path. */
function splitSymbolPath(
  path: string,
): { module: string; name: string } | null {
  const idx = path.indexOf("~/");
  if (idx === -1 || (idx !== 0 && path[idx - 1] !== "/")) return null;
  const module = idx === 0 ? "" : path.slice(0, idx - 1);
  const name = decodeURIComponent(path.slice(idx + 2));
  if (name === "") return null;
  return { module, name };
}

/** The namespace_section nodes of a category/module index, keyed by section
 * title. Deno/Web categories store them in `overview`, Node modules in
 * `module_doc`. */
function indexSections(index: IndexCtx): GroupSection[] {
  const content = index.overview ?? index.module_doc?.sections;
  const sections: GroupSection[] = [];
  for (const section of content?.sections ?? []) {
    if (section.content.kind !== "namespace_section") continue;
    const title = section.header?.title ?? "Symbols";
    sections.push({
      title,
      anchor: section.header?.anchor.id ?? title.toLowerCase(),
      nodes: section.content.content,
    });
  }
  return sections;
}

/** Matches relative links to symbol pages emitted by @deno/doc, e.g.
 * "../././~/Deno.FsFile#method_close_0" or "../.././fs/promises/~/FileHandle"
 * (Node). The whole match (sans fragment) is resolved as a relative path. */
const RELATIVE_SYMBOL_LINK =
  /(?:\.\.?\/)+(?:[\w.$%\][-]+\/)*~\/([^"#\s<>]+)(#[^"\s<>]+)?/g;

/** Matches absolute links to old per-symbol URLs, e.g. "/api/web/~/Blob". */
const ABSOLUTE_SYMBOL_LINK =
  /\/api\/(deno|web|node)\/((?:[\w.$%\][-]+\/)*~\/[^"#\s<>]+)(#[^"\s<>]+)?/g;

class Resolver {
  roots = new Map<string, RootInfo>();
  /** group URL per "<kind><module dir>", for best-effort fallbacks. */
  moduleUrls = new Map<string, string>();
  warnings = new Set<string>();

  addRoot(kind: ApiKind, module: string, name: string, url: string) {
    this.roots.set(rootKey(kind, module, name), { name, groupUrl: url });
  }

  /** Resolves a symbol name to its root symbol by longest dotted prefix:
   * "Deno.FsFile.prototype.close" -> "Deno.FsFile". */
  resolveRoot(kind: ApiKind, module: string, name: string): RootInfo | null {
    const parts = name.split(".");
    while (parts.length > 0) {
      const root = this.roots.get(rootKey(kind, module, parts.join(".")));
      if (root) return root;
      parts.pop();
    }
    return null;
  }

  /** New-site href for an old symbol path within `kind`, or null. */
  resolveSymbolPath(
    kind: ApiKind,
    path: string,
    fragment: string | undefined,
    context: string,
  ): string | null {
    const split = splitSymbolPath(path);
    if (!split) return null;
    const root = this.resolveRoot(kind, split.module, split.name);
    if (root) {
      if (split.name === root.name && fragment) {
        return `${root.groupUrl}#${root.name}.${fragment.slice(1)}`;
      }
      return `${root.groupUrl}#${root.name}`;
    }
    // Dead link in the source docs: fall back to the module page if one
    // exists, and report it.
    const moduleUrl = this.moduleUrls.get(`${kind}${split.module}`);
    this.warnings.add(
      `dead symbol link (${context}): ${kind} ${path}` +
        (moduleUrl ? ` -> falling back to ${moduleUrl}` : ""),
    );
    return moduleUrl ?? null;
  }
}

interface RewriteCtx {
  resolver: Resolver;
  apiKind: ApiKind;
  /** Directory of the source JSON entry, for relative link resolution. */
  currentDir: string;
  /** Root symbol whose subtree is being rewritten; used to namespace bare
   * fragment links and ids. null disables id/fragment prefixing. */
  rootName: string | null;
}

function rewriteSymbolLinks(value: string, ctx: RewriteCtx): string {
  let result = value.replaceAll(
    RELATIVE_SYMBOL_LINK,
    (match, _name: string, frag?: string) => {
      const path = frag ? match.slice(0, -frag.length) : match;
      const resolved = resolveRelative(ctx.currentDir, path);
      return ctx.resolver.resolveSymbolPath(
        ctx.apiKind,
        resolved,
        frag,
        ctx.rootName ?? ctx.currentDir,
      ) ?? match;
    },
  );
  result = result.replaceAll(
    ABSOLUTE_SYMBOL_LINK,
    (match, kind: ApiKind, path: string, frag?: string) => {
      return ctx.resolver.resolveSymbolPath(
        kind,
        path,
        frag,
        ctx.rootName ?? ctx.currentDir,
      ) ?? match;
    },
  );
  return result;
}

function rewriteString(value: string, ctx: RewriteCtx): string {
  let result = rewriteSymbolLinks(value, ctx);
  if (ctx.rootName !== null) {
    const prefix = ctx.rootName;
    // Bare fragment link as a whole field value (e.g. name_href: "#x").
    if (result.startsWith("#")) {
      return `#${prefix}.${result.slice(1)}`;
    }
    // Fragment links and anchor ids inside rendered HTML.
    result = result
      .replaceAll(/(href=")#([^"]+)(")/g, `$1#${prefix}.$2$3`)
      .replaceAll(/(\sid=")([^"]+)(")/g, `$1${prefix}.$2$3`);
  }
  return result;
}

/** Deep-rewrites a ctx subtree: prefixes every `id` field and rewrites every
 * string (links + embedded HTML ids/fragments). Returns a transformed copy. */
// deno-lint-ignore no-explicit-any
function rewriteValue(value: any, ctx: RewriteCtx): any {
  if (typeof value === "string") {
    return rewriteString(value, ctx);
  }
  if (Array.isArray(value)) {
    return value.map((item) => rewriteValue(item, ctx));
  }
  if (value !== null && typeof value === "object") {
    // deno-lint-ignore no-explicit-any
    const out: Record<string, any> = {};
    for (const [key, item] of Object.entries(value)) {
      if (key === "id" && typeof item === "string" && ctx.rootName !== null) {
        out[key] = item === "" ? item : `${ctx.rootName}.${item}`;
      } else {
        out[key] = rewriteValue(item, ctx);
      }
    }
    return out;
  }
  return value;
}

interface PendingGroup {
  apiKind: ApiKind;
  slug: string;
  /** Module dir for symbol page lookup: "" for deno/web, slug for node. */
  module: string;
  filepath: string;
  index: IndexCtx;
  sections: GroupSection[];
}

/** Renders a category description from *-categories.json (markdown-lite with
 * jsdoc {@linkcode X} tags) to HTML, resolving linkcodes to symbol anchors. */
function renderCategoryDocs(
  source: string,
  apiKind: ApiKind,
  resolver: Resolver,
): string {
  const paragraphs = source.trim().split(/\n\s*\n/).map((paragraph) => {
    const html = paragraph.replaceAll(
      /\{@linkcode\s+([^}\s]+)\s*\}/g,
      (_match, name: string) => {
        const root = resolver.resolveRoot(apiKind, "", name);
        return root
          ? `<a href="${root.groupUrl}#${root.name}"><code>${name}</code></a>`
          : `<code>${name}</code>`;
      },
    );
    return `<p>${html}</p>`;
  });
  return paragraphs.join("\n");
}

export function buildReference(
  jsons: Record<ApiKind, Record<string, Page>>,
  categoryDocs: Partial<Record<ApiKind, Record<string, string>>> = {},
): ReferenceResult {
  const resolver = new Resolver();
  const pending: PendingGroup[] = [];

  // Phase 1: collect every group's root symbols across all API kinds, so
  // cross-kind links can be resolved while rewriting.
  for (const apiKind of Object.keys(jsons) as ApiKind[]) {
    for (const [filepath, page] of Object.entries(jsons[apiKind])) {
      if (page.kind !== "IndexCtx") continue;
      const normalized = filepath.replace(/^\.\//, "");
      if (normalized === "index.json") continue; // package landing page
      const slug = normalized.replace(/\/?index\.json$/, "").replace(
        /\.json$/,
        "",
      );
      if (slug === "") continue;
      const module = apiKind === "node" ? slug : "";
      const url = groupUrl(apiKind, slug);
      const sections = indexSections(page);
      for (const section of sections) {
        for (const node of section.nodes) {
          resolver.addRoot(apiKind, module, node.name, url);
        }
      }
      resolver.moduleUrls.set(`${apiKind}${module}`, url);
      pending.push({ apiKind, slug, module, filepath, index: page, sections });
    }
  }

  // Phase 2: build the merged pages with rewritten links and anchors.
  const groups: Record<ApiKind, Group[]> = { deno: [], web: [], node: [] };
  for (const { apiKind, slug, module, filepath, index, sections } of pending) {
    const url = groupUrl(apiKind, slug);
    const json = jsons[apiKind];
    const symbols: GroupSymbol[] = [];
    const toc: ToCEntry[] = [];

    const indexCtx: RewriteCtx = {
      resolver,
      apiKind,
      currentDir: dirOf(filepath),
      rootName: null,
    };

    const rewrittenSections = sections.map((section) => ({
      ...section,
      nodes: rewriteValue(section.nodes, indexCtx),
    }));

    for (const section of sections) {
      toc.push({ level: 1, content: section.title, anchor: section.anchor });
      for (const node of section.nodes) {
        const symbolFilepath = module === ""
          ? `./~/${node.name}.json`
          : `${module}/~/${node.name}.json`;
        const page = json[symbolFilepath];
        if (page?.kind !== "SymbolPageCtx") {
          resolver.warnings.add(
            `missing symbol page for root ${node.name} (${symbolFilepath})`,
          );
          continue;
        }
        const symbolGroup = rewriteValue(
          (page as SymbolPageCtx).symbol_group_ctx,
          {
            resolver,
            apiKind,
            currentDir: dirOf(symbolFilepath),
            rootName: node.name,
          },
        ) as SymbolGroupCtx;
        symbols.push({
          name: node.name,
          anchor: node.name,
          kinds: node.doc_node_kind_ctx,
          symbolGroup,
        });
        toc.push({ level: 2, content: node.name, anchor: node.name });
      }
    }

    const title = index.breadcrumbs_ctx.parts.at(-1)?.name ?? slugToTitle(slug);
    const docsSource = index.overview?.docs ??
      index.module_doc?.sections.docs ?? null;
    const categoryDoc = categoryDocs[apiKind]?.[title];

    groups[apiKind].push({
      apiKind,
      slug,
      url,
      title,
      docs: docsSource
        ? rewriteString(docsSource, indexCtx)
        : categoryDoc
        ? renderCategoryDocs(categoryDoc, apiKind, resolver)
        : null,
      usage: rewriteValue(index.usage ?? null, indexCtx),
      breadcrumbs: rewriteValue(index.breadcrumbs_ctx, indexCtx),
      sections: rewrittenSections,
      symbols,
      toc,
    });
  }

  // Stable ordering: alphabetical, catch-all category last.
  for (const apiKind of Object.keys(groups) as ApiKind[]) {
    groups[apiKind].sort((a, b) =>
      Number(a.title === "Uncategorized") -
        Number(b.title === "Uncategorized") ||
      (apiKind === "node"
        ? a.slug.localeCompare(b.slug)
        : a.title.localeCompare(b.title))
    );
  }

  // Phase 3: redirect map for every old per-symbol URL.
  const redirects: Record<string, string> = {};
  for (const apiKind of Object.keys(jsons) as ApiKind[]) {
    for (const [filepath, page] of Object.entries(jsons[apiKind])) {
      let resolved: string | null = null;

      if (page.kind === "SymbolPageCtx") {
        const path = filepath.replace(/^\.\//, "").replace(/\.json$/, "");
        resolved = resolver.resolveSymbolPath(
          apiKind,
          path,
          undefined,
          `redirect for ${filepath}`,
        );
      } else if ("path" in page && typeof page.path === "string") {
        // Redirect entry emitted by @deno/doc, either relative
        // ("../././~/Deno.errors.NotFound") or absolute ("/api/web/~/Blob").
        const absolute = new RegExp(ABSOLUTE_SYMBOL_LINK.source).exec(
          page.path,
        );
        if (absolute) {
          resolved = resolver.resolveSymbolPath(
            absolute[1] as ApiKind,
            absolute[2],
            absolute[3],
            `redirect for ${filepath}`,
          );
        } else {
          resolved = resolver.resolveSymbolPath(
            apiKind,
            resolveRelative(dirOf(filepath), page.path),
            undefined,
            `redirect for ${filepath}`,
          );
        }
      } else {
        continue;
      }

      if (resolved) {
        redirects[oldUrl(apiKind, filepath)] = resolved;
      }
    }
  }

  return {
    groups,
    redirects,
    warnings: [...resolver.warnings].sort(),
    rewritePage: (apiKind, filepath, value) =>
      rewriteValue(value, {
        resolver,
        apiKind,
        currentDir: dirOf(filepath),
        rootName: null,
      }),
  };
}

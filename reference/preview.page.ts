/**
 * PROTOTYPE: renders node:http directly from raw `deno doc --json` output
 * (doc nodes) instead of @deno/doc's generateHtmlAsJSON, in the prose-first
 * style of the Node.js documentation.
 *
 * Served at /api/preview/node-http/ alongside the regular pages so the two
 * renderers can be compared. Generate the input with:
 *
 *   deno doc --json reference_gen/types/node/node__http.d.ts \
 *     > reference_gen/gen/raw-node-http.json
 */

export const layout = "raw.tsx";

const SOURCE = "reference_gen/gen/raw-node-http.json";
const MODULE = "http";

// ---------------------------------------------------------------------------
// Raw doc-node shapes (the subset we consume).
// deno-lint-ignore-file no-explicit-any

interface JsDoc {
  doc?: string;
  tags?: { kind: string; doc?: string; name?: string }[];
}

interface Declaration {
  kind: string;
  jsDoc?: JsDoc;
  def?: any;
}

interface RawSymbol {
  name: string;
  declarations: Declaration[];
}

// ---------------------------------------------------------------------------
// Render-friendly shapes consumed by _includes/reference/preview.tsx.

export interface PreviewMember {
  /** e.g. "server.setTimeout([msecs][, callback])" or "request.aborted" */
  signature: string;
  anchor: string;
  since: string | null;
  deprecated: string | null;
  doc: string | null;
  returnType: string | null;
}

export interface PreviewSymbol {
  kind: string;
  /** e.g. "Class: http.Server" */
  heading: string;
  /** e.g. "http.request(options[, callback])" */
  signature: string | null;
  anchor: string;
  since: string | null;
  deprecated: string | null;
  doc: string | null;
  returnType: string | null;
  members: PreviewMember[];
}

function tag(jsDoc: JsDoc | undefined, kind: string): string | null {
  const t = jsDoc?.tags?.find((t) => t.kind === kind);
  return t ? (t.doc ?? "") : null;
}

/** Plain-text type from a doc-node type AST, good enough for inline display. */
function typeText(t: any): string {
  if (!t) return "";
  if (t.repr) return t.repr;
  switch (t.kind) {
    case "keyword":
    case "literal":
      return String(t.value?.string ?? t.value ?? t.repr ?? "");
    case "typeRef": {
      const name = t.value?.typeName ?? "";
      const params = t.value?.typeParams?.map(typeText).join(", ");
      return params ? `${name}<${params}>` : name;
    }
    case "union":
      return t.value.map(typeText).join(" | ");
    case "intersection":
      return t.value.map(typeText).join(" & ");
    case "array":
      return `${typeText(t.value)}[]`;
    case "parenthesized":
      return `(${typeText(t.value)})`;
    case "fnOrConstructor":
      return "Function";
    case "typeLiteral":
      return "Object";
    default:
      return t.kind ?? "";
  }
}

function paramName(p: any): string {
  if (p.kind === "rest") return `...${paramName(p.arg)}`;
  if (p.kind === "assign") return paramName(p.left);
  if (p.kind === "object") return "options";
  if (p.kind === "array") return "values";
  return p.name ?? "arg";
}

/** Node-style call signature: request(options[, callback]) */
function callSignature(prefix: string, name: string, params: any[]): string {
  let out = "";
  let openedBrackets = 0;
  for (let i = 0; i < params.length; i++) {
    const p = params[i];
    const optional = p.optional || p.kind === "assign";
    const pname = paramName(p);
    if (i === 0) {
      out += optional ? `[${pname}` : pname;
      if (optional) openedBrackets++;
    } else if (optional) {
      out += `[, ${pname}`;
      openedBrackets++;
    } else {
      out += `, ${pname}`;
    }
  }
  out += "]".repeat(openedBrackets);
  return `${prefix}${name}(${out})`;
}

function functionMember(
  prefix: string,
  name: string,
  decl: { jsDoc?: JsDoc; functionDef?: any; optional?: boolean },
  anchorPrefix: string,
): PreviewMember {
  return {
    signature: callSignature(prefix, name, decl.functionDef?.params ?? []),
    anchor: `${anchorPrefix}.${name}`,
    since: tag(decl.jsDoc, "since"),
    deprecated: tag(decl.jsDoc, "deprecated"),
    doc: decl.jsDoc?.doc ?? null,
    returnType: typeText(decl.functionDef?.returnType) || null,
  };
}

function propertyMember(
  prefix: string,
  name: string,
  decl: { jsDoc?: JsDoc; tsType?: any },
  anchorPrefix: string,
): PreviewMember {
  const type = typeText(decl.tsType);
  return {
    signature: `${prefix}${name}${type ? `: ${type}` : ""}`,
    anchor: `${anchorPrefix}.${name}`,
    since: tag(decl.jsDoc, "since"),
    deprecated: tag(decl.jsDoc, "deprecated"),
    doc: decl.jsDoc?.doc ?? null,
    returnType: null,
  };
}

/** Members sorted documented-first, then alphabetically. */
function sortMembers(members: PreviewMember[]): PreviewMember[] {
  return members.sort((a, b) =>
    Number(Boolean(b.doc)) - Number(Boolean(a.doc)) ||
    a.signature.localeCompare(b.signature)
  );
}

function transformSymbol(symbol: RawSymbol): PreviewSymbol | null {
  const decl = symbol.declarations[0];
  if (!decl) return null;
  const name = symbol.name;
  const jsDoc = decl.jsDoc;
  const base: Omit<PreviewSymbol, "kind" | "heading" | "signature"> = {
    anchor: name,
    since: tag(jsDoc, "since"),
    deprecated: tag(jsDoc, "deprecated"),
    doc: jsDoc?.doc ?? null,
    returnType: null,
    members: [],
  };

  switch (decl.kind) {
    case "function":
      return {
        ...base,
        kind: "function",
        heading: callSignature(`${MODULE}.`, name, decl.def?.params ?? []),
        signature: null,
        returnType: typeText(decl.def?.returnType) || null,
      };
    case "class": {
      const def = decl.def ?? {};
      const instance = name.charAt(0).toLowerCase() + name.slice(1);
      const members: PreviewMember[] = [];
      for (const ctor of def.constructors ?? []) {
        members.push({
          signature: callSignature(
            "new ",
            `${MODULE}.${name}`,
            ctor.params ?? [],
          ),
          anchor: `${name}.constructor`,
          since: tag(ctor.jsDoc, "since"),
          deprecated: null,
          doc: ctor.jsDoc?.doc ?? null,
          returnType: null,
        });
      }
      const props = (def.properties ?? []).filter((p: any) => !p.isStatic);
      const methods = (def.methods ?? []).filter((m: any) => !m.isStatic);
      const seen = new Set<string>();
      const propAndMethodMembers: PreviewMember[] = [];
      for (const p of props) {
        propAndMethodMembers.push(
          propertyMember(`${instance}.`, p.name, p, name),
        );
      }
      for (const m of methods) {
        if (seen.has(m.name)) continue; // collapse overloads to the first
        seen.add(m.name);
        propAndMethodMembers.push(
          functionMember(`${instance}.`, m.name, m, name),
        );
      }
      members.push(...sortMembers(propAndMethodMembers));
      return {
        ...base,
        kind: "class",
        heading: `Class: ${MODULE}.${name}`,
        signature: null,
        members,
      };
    }
    case "interface": {
      const def = decl.def ?? {};
      const members: PreviewMember[] = [];
      for (const p of def.properties ?? []) {
        members.push(propertyMember("", p.name, p, name));
      }
      for (const m of def.methods ?? []) {
        members.push(functionMember("", m.name, m, name));
      }
      return {
        ...base,
        kind: "interface",
        heading: `Interface: ${name}`,
        signature: null,
        members: sortMembers(members),
      };
    }
    case "typeAlias":
      return {
        ...base,
        kind: "typeAlias",
        heading: `Type: ${name}`,
        signature: `type ${name} = ${typeText(decl.def?.tsType)}`,
      };
    case "variable":
      return {
        ...base,
        kind: "variable",
        heading: `${MODULE}.${name}`,
        signature: null,
        returnType: typeText(decl.def?.tsType) || null,
      };
    default:
      return null;
  }
}

const KIND_ORDER = ["class", "function", "interface", "typeAlias", "variable"];
const KIND_TITLES: Record<string, string> = {
  class: "Classes",
  function: "Functions",
  interface: "Interfaces",
  typeAlias: "Type aliases",
  variable: "Variables",
};

export default function* () {
  let raw: { nodes: Record<string, { symbols: RawSymbol[] }> };
  try {
    raw = JSON.parse(Deno.readTextFileSync(SOURCE));
  } catch {
    // Prototype input not generated; skip silently.
    return;
  }

  const symbols = Object.values(raw.nodes)[0].symbols
    .map(transformSymbol)
    .filter((s): s is PreviewSymbol => s !== null)
    .sort((a, b) =>
      KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) ||
      a.anchor.localeCompare(b.anchor)
    );

  const toc = [];
  for (const kind of KIND_ORDER) {
    const group = symbols.filter((s) => s.kind === kind);
    if (group.length === 0) continue;
    toc.push({ level: 1, content: KIND_TITLES[kind], anchor: `kind-${kind}` });
    for (const s of group) {
      toc.push({ level: 2, content: s.heading, anchor: s.anchor });
    }
  }

  yield {
    url: "/api/preview/node-http/",
    title: "node:http (renderer preview)",
    description:
      "Prototype of rendering node:http from raw doc nodes in a Node.js-style prose-first format.",
    layout: "reference/preview.tsx",
    data: {
      module: MODULE,
      usage: `import * as http from "node:${MODULE}";`,
      symbols,
      kindOrder: KIND_ORDER,
      kindTitles: KIND_TITLES,
      toc_ctx: {
        usages: null,
        top_symbols: null,
        document_navigation_str: null,
        document_navigation: toc,
      },
    },
  };
}

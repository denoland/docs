import "@std/dotenv/load";

import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import jsx from "lume/plugins/jsx.ts";
import mdx from "lume/plugins/mdx.ts";
import ogImages from "lume/plugins/og_images.ts";
import redirects from "lume/plugins/redirects.ts";
import search from "lume/plugins/search.ts";
import sitemap from "lume/plugins/sitemap.ts";
import tailwind from "lume/plugins/tailwindcss.ts";

import Prism from "./prism.ts";

import title from "https://deno.land/x/lume_markdown_plugins@v0.7.0/title.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
// See note below about GFM CSS
// import { CSS as GFM_CSS } from "https://jsr.io/@deno/gfm/0.11.0/style.ts";
import { walk } from "@std/fs";
import { dirname } from "@std/path";
import { log } from "lume/core/utils/log.ts";
import anchor from "npm:markdown-it-anchor@9";
import admonitionPlugin from "./markdown-it/admonition.ts";
import codeblockCopyPlugin from "./markdown-it/codeblock-copy.ts";
import codeblockTitlePlugin from "./markdown-it/codeblock-title.ts";
import relativeLinksPlugin from "./markdown-it/relative-path.ts";
import replacerPlugin from "./markdown-it/replacer.ts";
import apiDocumentContentTypeMiddleware from "./middleware/apiDocContentType.ts";
import createRoutingMiddleware from "./middleware/functionRoutes.ts";
import createGAMiddleware from "./middleware/googleAnalytics.ts";
import redirectsMiddleware from "./middleware/redirects.ts";
import createLlmsFilesMiddleware from "./middleware/llmsFiles.ts";
import createMarkdownSourceMiddleware from "./middleware/markdownSource.ts";
import { toFileAndInMemory } from "./utils/redirects.ts";
import { cliNow } from "./timeUtils.ts";

// Build profiling — set LUME_PROFILE=1 to enable timing output
const PROFILE = Deno.env.has("LUME_PROFILE");

function profileLog(message: string) {
  if (PROFILE) {
    console.log(`[profile] ${message}`);
  }
}

// Check if reference docs are available when building
function ensureReferenceDocsExist() {
  const requiredFiles = [
    "reference_gen/gen/deno.json",
    "reference_gen/gen/web.json",
    "reference_gen/gen/node.json",
  ];

  const missingFiles = [];
  for (const file of requiredFiles) {
    try {
      Deno.statSync(file);
    } catch {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    console.error(
      `❌ Missing reference documentation files: ${missingFiles.join(", ")}`,
    );
    console.error(
      `   Run 'deno task generate:reference' to generate them before building`,
    );
    console.error(`   Or set SKIP_REFERENCE=1 to skip reference documentation`);
    Deno.exit(1);
  }
}

// Ensure reference docs exist at startup for full builds
if (
  Deno.env.get("BUILD_TYPE") === "FULL" &&
  Deno.env.get("SKIP_REFERENCE") !== "1"
) {
  ensureReferenceDocsExist();
}

const site = lume(
  {
    location: new URL("https://docs.deno.com"),
    caseSensitiveUrls: true,
    emptyDest: false,
    server: {
      middlewares: [
        redirectsMiddleware,
        createMarkdownSourceMiddleware({ root: "_site" }),
        createRoutingMiddleware(),
        createGAMiddleware({
          addr: { transport: "tcp", hostname: "localhost", port: 3000 },
        }),
        createLlmsFilesMiddleware({ root: "_site" }),
        apiDocumentContentTypeMiddleware,
      ],
      page404: "/404/",
    },
    watcher: {
      ignore: ["/.git", "/.github", "/.vscode"],
      debounce: 1_000,
    },
  },
  {
    markdown: {
      plugins: [
        replacerPlugin,
        admonitionPlugin,
        codeblockCopyPlugin,
        codeblockTitlePlugin,
        [
          anchor,
          {
            permalink: anchor.permalink.linkInsideHeader({
              symbol:
                `<span class="sr-only">Jump to heading</span><span aria-hidden="true" class="anchor-end">#</span>`,
              placement: "after",
            }),
            getTokensText(tokens: { type: string; content: string }[]) {
              return tokens
                .filter((t) => ["text", "code_inline"].includes(t.type))
                .map((t) => t.content.replaceAll(/ \([0-9/]+?\)/g, ""))
                .join("")
                .trim();
            },
          },
        ],
        relativeLinksPlugin,
      ],
      options: {
        linkify: true,
        langPrefix: "highlight notranslate language-",
        highlight: (code, lang) => {
          if (!lang || !Prism.languages[lang]) {
            return code;
          }
          const result = Prism.highlight(code, Prism.languages[lang], lang);
          return result || code;
        },
      },
    },
  },
);

// Build phase profiling
if (PROFILE) {
  const phases = [
    "beforeBuild",
    "afterLoad",
    "beforeRender",
    "afterRender",
    "beforeSave",
    "afterBuild",
  ] as const;

  for (const phase of phases) {
    site.addEventListener(phase, () => {
      performance.mark(`lume-${phase}`);
      profileLog(`phase: ${phase}`);
    });
  }

  // Wrap site.process() to time each processor
  const processorTimings: { name: string; duration: number }[] = [];
  const originalProcess = site.process.bind(site);
  // deno-lint-ignore no-explicit-any
  site.process = function (extOrFn: any, fn?: any) {
    // site.process(extensions, fn) or site.process(fn)
    const actualFn = fn ?? extOrFn;
    const extensions = fn ? extOrFn : "*";
    const name = actualFn.name || `processor(${extensions})`;

    // deno-lint-ignore no-explicit-any
    const wrappedFn = async function (...args: any[]) {
      const start = performance.now();
      const result = await actualFn(...args);
      processorTimings.push({
        name,
        duration: performance.now() - start,
      });
      return result;
    };
    Object.defineProperty(wrappedFn, "name", { value: name });

    if (fn) {
      return originalProcess(extOrFn, wrappedFn);
    }
    return originalProcess(wrappedFn);
  };

  // Print timing summary at idle (after all build work is done)
  site.addEventListener("idle", () => {
    console.log("\n[profile] === Build Phase Timings ===");
    const pairs: [string, string, string][] = [
      ["scan+load", "lume-beforeBuild", "lume-afterLoad"],
      ["render", "lume-beforeRender", "lume-afterRender"],
      ["process+save", "lume-afterRender", "lume-beforeSave"],
      ["write", "lume-beforeSave", "lume-afterBuild"],
      ["afterBuild hooks", "lume-afterBuild", "lume-idle"],
      ["total", "lume-beforeBuild", "lume-idle"],
    ];

    // Mark idle so we can measure afterBuild→idle
    performance.mark("lume-idle");

    for (const [label, start, end] of pairs) {
      try {
        const measure = performance.measure(label, start, end);
        console.log(
          `[profile]   ${label.padEnd(20)} ${
            (measure.duration / 1000).toFixed(2)
          }s`,
        );
      } catch {
        console.log(`[profile]   ${label.padEnd(20)} (no data)`);
      }
    }

    // Aggregate processor timings by name
    if (processorTimings.length > 0) {
      const aggregated = new Map<string, { total: number; calls: number }>();
      for (const { name, duration } of processorTimings) {
        const existing = aggregated.get(name) ?? { total: 0, calls: 0 };
        existing.total += duration;
        existing.calls++;
        aggregated.set(name, existing);
      }

      console.log("\n[profile] === Processor Timings ===");
      const sorted = [...aggregated.entries()].sort((a, b) =>
        b[1].total - a[1].total
      );
      for (const [name, { total, calls }] of sorted) {
        console.log(
          `[profile]   ${name.padEnd(30)} ${
            (total / 1000).toFixed(2)
          }s (${calls} calls)`,
        );
      }
    }
    console.log("");
  });
}

// ignore some folders that have their own build tasks
// site.ignore("styleguide");

site.copy("static", ".");
site.copy("timeUtils.ts");
site.copy("subhosting/api/images");
site.copy("deploy/docs-images");
site.copy("deploy/images");
site.copy("deploy/classic/images");
site.copy("deploy/kv/images");
site.copy("deploy/tutorials/images");
site.copy("sandbox/images");
site.copy("runtime/fundamentals/images");
site.copy("runtime/getting_started/images");
site.copy("runtime/reference/images");
site.copy("runtime/contributing/images");
site.copy("examples/tutorials/images");
site.copy("deploy/manual/images");
site.copy("examples/scripts");

site.use(
  redirects({
    output: toFileAndInMemory,
  }),
);

site.use(search());
site.use(jsx());
site.use(mdx());

site.add("js");
site.use(
  esbuild({
    extensions: [".ts"],
    options: {
      minify: false,
      splitting: true,
      alias: {
        "node:crypto": "./_node-crypto.js",
      },
    },
  }),
);

site.add("style.css");
site.use(tailwind({
  minify: true,
}));

site.use(toc({ anchor: false }));
site.use(title());
site.use(sitemap());

site.addEventListener("afterBuild", async () => {
  // Run all post-build tasks in parallel since they're independent
  await Promise.all([
    // 1. Copy lint rule markdown source files to _site
    (async () => {
      try {
        await Deno.mkdir(site.dest("lint/rules"), { recursive: true });
        const copies: Promise<void>[] = [];
        for await (const entry of Deno.readDir("lint/rules")) {
          if (entry.isFile && entry.name.endsWith(".md")) {
            copies.push(Deno.copyFile(
              `lint/rules/${entry.name}`,
              site.dest(`lint/rules/${entry.name}`),
            ));
          }
        }
        await Promise.all(copies);
        log.info("Copied lint rule markdown files to _site/lint/rules/");
      } catch (error) {
        log.error("Error copying lint rule markdown files: " + error);
      }
    })(),

    // 2. Generate LLMs documentation files
    (async () => {
      if (Deno.env.get("BUILD_TYPE") != "FULL") return;
      try {
        const { default: generateModule } = await import(
          "./generate_llms_files.ts"
        );
        const {
          collectFiles,
          generateLlmsSummaryTxt,
          generateLlmsFullTxt,
          generateLlmsJson,
          loadOramaSummaryIndex,
        } = generateModule;

        log.info("Generating LLM-friendly documentation files...");

        const [files, oramaSummary] = await Promise.all([
          collectFiles(),
          loadOramaSummaryIndex(),
        ]);
        log.info(`Collected ${files.length} documentation files for LLMs`);

        // Generate all LLM files in parallel
        const writes: Promise<void>[] = [];

        const llmsSummaryTxt = generateLlmsSummaryTxt(files);
        writes.push(
          Deno.writeTextFile(site.dest("llms-summary.txt"), llmsSummaryTxt),
        );

        const llmsFullTxt = generateLlmsFullTxt(files);
        writes.push(
          Deno.writeTextFile(site.dest("llms-full.txt"), llmsFullTxt),
        );

        if (oramaSummary) {
          const llmsJson = generateLlmsJson(oramaSummary);
          writes.push(
            Deno.writeTextFile(site.dest("llms.json"), llmsJson),
          );
        } else {
          log.warn(
            "Skipped llms.json generation (orama-index-summary.json not found)",
          );
        }

        await Promise.all(writes);
        log.info("Generated LLM documentation files");
      } catch (error) {
        log.error("Error generating LLMs files:" + error);
      }
    })(),

    // 3. Copy source .md files to _site for AI agents
    (async () => {
      const contentDirs = [
        "runtime",
        "deploy",
        "sandbox",
        "subhosting",
        "examples",
      ];
      let mdCopied = 0;
      let mdErrors = false;
      for (const dir of contentDirs) {
        try {
          await Deno.stat(dir);
        } catch (error) {
          if (!(error instanceof Deno.errors.NotFound)) {
            log.error(`Error accessing content directory ${dir}: ${error}`);
          }
          continue;
        }
        try {
          const copies: Promise<void>[] = [];
          for await (
            const entry of walk(dir, { exts: [".md"], includeDirs: false })
          ) {
            const destPath = site.dest(entry.path);
            copies.push(
              Deno.mkdir(dirname(destPath), { recursive: true })
                .then(() => Deno.copyFile(entry.path, destPath)),
            );
            mdCopied++;
          }
          await Promise.all(copies);
        } catch (error) {
          log.error(`Error copying markdown files from ${dir}: ${error}`);
          mdErrors = true;
        }
      }
      if (mdErrors) {
        log.warn(
          `Copied ${mdCopied} source markdown files to _site (some directories had errors, see above)`,
        );
      } else {
        log.info(`Copied ${mdCopied} source markdown files to _site`);
      }
    })(),
  ]);
});

site.copy("reference_gen/gen/deno/page.css", "/api/deno/page.css");
site.copy("reference_gen/gen/deno/styles.css", "/api/deno/styles.css");
site.copy("reference_gen/gen/deno/script.js", "/api/deno/script.js");

site.copy("reference_gen/gen/web/page.css", "/api/web/page.css");
site.copy("reference_gen/gen/web/styles.css", "/api/web/styles.css");
site.copy("reference_gen/gen/web/script.js", "/api/web/script.js");

site.copy("reference_gen/gen/node/page.css", "/api/node/page.css");
site.copy("reference_gen/gen/node/styles.css", "/api/node/styles.css");
site.copy("reference_gen/gen/node/script.js", "/api/node/script.js");

site.ignore(
  "old",
  "README.md",
  (path) => path.match(/\/reference_gen.*.ts/) !== null,
  (path) => path.includes("/reference_gen/node_modules"),
  (path) => path.includes("/reference_gen/node_descriptions"),
  (path) => path.includes("/lint/rules/"),
  // "deploy",
  // "runtime",
  // "subhosting",
  // "404",
);

// the default layout if no other layout is specified
site.data("layout", "doc.tsx");

// Populate lastModified from pre-generated JSON (see scripts/generate_last_modified.ts)
site.preprocess([".md", ".mdx"], (filteredPages) => {
  let lastModified: Record<string, string>;
  try {
    lastModified = JSON.parse(Deno.readTextFileSync("lastModified.json"));
  } catch {
    console.warn(
      "Warning: lastModified.json not found — skipping last-modified dates.",
      "Run `deno task generate:last-modified` to generate it.",
    );
    return;
  }

  for (const page of filteredPages) {
    const src = page.sourcePath?.replace(/^\//, "");
    if (src && src in lastModified) {
      page.data.lastModified = new Date(lastModified[src]);
    }
  }
});

// Load API categories data globally
import denoCategories from "./reference_gen/deno-categories.json" with {
  type: "json",
};
import webCategories from "./reference_gen/web-categories.json" with {
  type: "json",
};
import nodeRewriteMap from "./reference_gen/node-rewrite-map.json" with {
  type: "json",
};

const nodeCategories = Object.keys(nodeRewriteMap);

site.data("apiCategories", {
  deno: {
    title: "Deno APIs",
    categories: Object.keys(denoCategories),
    descriptions: denoCategories,
    getCategoryHref: (categoryName: string) => {
      // Special case for I/O -> io
      if (categoryName === "I/O") {
        return `/api/deno/io`;
      }
      return `/api/deno/${categoryName.toLowerCase().replace(/\s+/g, "-")}`;
    },
  },
  web: {
    title: "Web APIs",
    categories: Object.keys(webCategories),
    descriptions: webCategories,
    getCategoryHref: (categoryName: string) => {
      // Special case for I/O -> io
      if (categoryName === "I/O") {
        return `/api/web/io`;
      }
      return `/api/web/${categoryName.toLowerCase().replace(/\s+/g, "-")}`;
    },
  },
  node: {
    title: "Node APIs",
    categories: nodeCategories,
    descriptions: {} as Record<string, string>,
    getCategoryHref: (categoryName: string) => `/api/node/${categoryName}/`,
  },
});

// Do more expensive operations if we're building the full site
if (Deno.env.get("BUILD_TYPE") == "FULL" && !Deno.env.has("SKIP_OG")) {
  // Generate Open Graph images
  site.data("openGraphLayout", "/open_graph/default.jsx");
  site.use(
    ogImages({
      options: {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Courier",
            style: "normal",
            data: (await Deno.readFile(
              "./static/fonts/courier/CourierPrime-Regular.ttf",
            )).buffer,
          },
          {
            name: "Inter",
            weight: 400,
            style: "normal",
            data: (await Deno.readFile(
              "./static/fonts/inter/hacked/Inter-Regular-hacked.woff",
            )).buffer,
          },
          {
            name: "Inter",
            weight: 700,
            style: "normal",
            data: (await Deno.readFile(
              "./static/fonts/inter/hacked/Inter-SemiBold-hacked.woff",
            )).buffer,
          },
        ],
      },
    }),
  );
}

site.scopedUpdates(
  (path) => /\.(js|ts)$/.test(path),
  (path) => path.startsWith("/api/deno/"),
);

site.addEventListener("afterStartServer", () => {
  log.warn(
    `${cliNow()} Server available at <green>http://localhost:3000</green>`,
  );
});

export default site;

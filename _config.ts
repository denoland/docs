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
if (Deno.env.get("BUILD_TYPE") === "FULL" && !Deno.env.has("SKIP_REFERENCE")) {
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
  // Write GFM CSS
  /* NOTE: we used to get gfm.css from the jsr.io CDN, but now we simply have a local copy. This is because it needs to be placed on a CSS layer, which isn't possible with an imported file. */
  // Deno.writeTextFileSync(site.dest("gfm.css"), GFM_CSS);

  // Generate LLMs documentation files directly to _site directory
  if (Deno.env.get("BUILD_TYPE") == "FULL") {
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

      const files = await collectFiles();
      log.info(`Collected ${files.length} documentation files for LLMs`);

      // Generate llms-summary.txt
      const llmsSummaryTxt = generateLlmsSummaryTxt(files);
      Deno.writeTextFileSync(site.dest("llms-summary.txt"), llmsSummaryTxt);
      log.info("Generated llms-summary.txt in site root");

      // Generate llms-full.txt
      const llmsFullTxt = generateLlmsFullTxt(files);
      Deno.writeTextFileSync(site.dest("llms-full.txt"), llmsFullTxt);
      log.info("Generated llms-full.txt in site root");

      // Generate llms.json
      const oramaSummary = await loadOramaSummaryIndex();
      if (oramaSummary) {
        const llmsJson = generateLlmsJson(oramaSummary);
        Deno.writeTextFileSync(site.dest("llms.json"), llmsJson);
        log.info("Generated llms.json in site root");
      } else {
        log.warn(
          "Skipped llms.json generation (orama-index-summary.json not found)",
        );
      }
    } catch (error) {
      log.error("Error generating LLMs files:" + error);
    }
  }

  // Copy source .md files to _site so AI agents can request them directly.
  // Excludes "reference/" (dynamically generated, no static .md source files).
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
    // Skip directories that don't exist in this build
    try {
      await Deno.stat(dir);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        continue;
      }
      log.error(`Error accessing content directory ${dir}: ${error}`);
      continue;
    }
    try {
      for await (
        const entry of walk(dir, { exts: [".md"], includeDirs: false })
      ) {
        const destPath = site.dest(entry.path);
        await Deno.mkdir(dirname(destPath), { recursive: true });
        await Deno.copyFile(entry.path, destPath);
        mdCopied++;
      }
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
  // Use Lume's built in date function to get the last modified date of the file
  // site.data("date", "Git Last Modified");;

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

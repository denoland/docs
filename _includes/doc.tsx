import { getSectionData } from "../_components/Navigation.tsx";
import type { Sidebar, SidebarItem } from "../types.ts";
import renderCommand from "./renderCommand.tsx";

export const layout = "layout.tsx";

// Flatten the section sidebar into reading order for prev/next pagination.
// Only string-titled, internal links participate (JSX titles and external
// URLs are skipped).
function flattenSidebar(sidebar: Sidebar): { title: string; href: string }[] {
  const out: { title: string; href: string }[] = [];
  const visit = (items?: SidebarItem[]) => {
    for (const item of items ?? []) {
      if (
        item.href && typeof item.title === "string" && !item.externalUrl &&
        item.href.startsWith("/")
      ) {
        out.push({ title: item.title, href: item.href });
      }
      visit(item.items);
    }
  };
  for (const section of sidebar ?? []) {
    if (section.href && typeof section.title === "string") {
      out.push({ title: section.title, href: section.href });
    }
    visit(section.items);
  }
  return out;
}

// Breadcrumb trail for the page header: the section the page lives in, plus
// the parent group when the page is nested inside one. The current page
// itself is not a crumb — the h1 right below completes the trail.
function findBreadcrumbs(
  sidebar: Sidebar,
  url: string,
): { title: string; href?: string }[] {
  const norm = (u?: string) => (u ?? "").replace(/\/$/, "");
  const target = norm(url);
  for (const section of sidebar ?? []) {
    if (typeof section.title !== "string") continue;
    const sectionCrumb = { title: section.title, href: section.href };
    if (section.href && norm(section.href) === target) return [sectionCrumb];
    for (const item of section.items ?? []) {
      if (norm(item.href) === target) return [sectionCrumb];
      for (const sub of item.items ?? []) {
        if (norm(sub.href) === target) {
          return typeof item.title === "string"
            ? [sectionCrumb, { title: item.title, href: item.href }]
            : [sectionCrumb];
        }
      }
    }
  }
  return [];
}

export const ogImage = (data: Lume.Data) => `${data.url}/index.png`;

export default function Doc(data: Lume.Data, helpers: Lume.Helpers) {
  // Flags and simple derivations
  const API_LANDING = new Set(["/api/deno/", "/api/web/", "/api/node/"]);
  const isReference = data.url.startsWith("/api/");
  const isApiLandingPage = API_LANDING.has(data.url);
  const isExampleScript = Boolean(
    (data.page.data.content as { type?: string })?.type,
  );
  const isLintRule = data.url.startsWith("/lint/rules/");

  // Compute file path used by Feedback component
  const file = isLintRule
    ? `/lint/rules/${encodeURIComponent(data.title ?? "")}.md`
    : data.page.sourcePath;

  // Render command block and merge its TOC if present
  let renderedCommand: unknown = null;
  if (data.command) {
    const { rendered, toc } = renderCommand(data.command, helpers);
    renderedCommand = rendered;
    data.toc = [...data.toc, ...toc];
  }

  function getTocCtx(
    d: Lume.Data,
  ): { document_navigation: unknown; document_navigation_str: string } | null {
    const tocCandidate =
      (d.data as { toc_ctx?: unknown } | undefined)?.toc_ctx ??
        (d as {
          children?: { props?: { data?: { toc_ctx?: unknown } } };
        })?.children?.props?.data?.toc_ctx;

    if (
      tocCandidate &&
      typeof tocCandidate === "object" &&
      "document_navigation" in tocCandidate &&
      "document_navigation_str" in tocCandidate
    ) {
      return tocCandidate as {
        document_navigation: unknown;
        document_navigation_str: string;
      };
    }
    return null;
  }

  const tocCtx = getTocCtx(data);

  const sectionData = !isReference && !isLintRule
    ? getSectionData(data, data.url)
    : null;
  const breadcrumbs = Array.isArray(sectionData)
    ? findBreadcrumbs(sectionData, data.url)
    : [];

  // Prev/next pagination, derived from the section sidebar's reading order.
  let prevPage: { title: string; href: string } | null = null;
  let nextPage: { title: string; href: string } | null = null;
  if (sectionData) {
    const seen = new Set<string>();
    const flat = (Array.isArray(sectionData) ? flattenSidebar(sectionData) : [])
      .filter((item) => seen.has(item.href) ? false : seen.add(item.href));
    const index = flat.findIndex((item) => item.href === data.url);
    if (index !== -1) {
      prevPage = flat[index - 1] ?? null;
      nextPage = flat[index + 1] ?? null;
    }
  }

  return (
    <>
      <main
        id="content"
        tabIndex={-1}
        class={`content ${isExampleScript ? "examples-content" : ""}`}
      >
        <div class="w-full">
          <article class="mx-auto">
            <data.comp.TableOfContentsMobile toc={data.toc} data={data} />

            <div
              data-color-mode="auto"
              data-light-theme="light"
              data-dark-theme="dark"
              class="markdown-body mt-4"
            >
              {!(isReference && !isApiLandingPage) && (
                <div className="block mb-2 space-y-2">
                  <header class="flex flex-wrap items-center justify-between gap-2">
                    {breadcrumbs.length > 0
                      ? (
                        <nav
                          aria-label="Breadcrumb"
                          className="font-bold uppercase leading-none text-sm text-foreground-secondary"
                        >
                          <ol className="flex flex-wrap items-center gap-2 m-0 p-0 list-none">
                            {breadcrumbs.map((crumb, i) => (
                              <li
                                key={crumb.title}
                                className="flex items-center gap-2 m-0"
                              >
                                {crumb.href
                                  ? (
                                    <a
                                      href={crumb.href}
                                      className="text-inherit no-underline hover:underline"
                                    >
                                      {crumb.title}
                                    </a>
                                  )
                                  : crumb.title}
                                {i < breadcrumbs.length - 1 && (
                                  <span aria-hidden="true">›</span>
                                )}
                              </li>
                            ))}
                          </ol>
                        </nav>
                      )
                      : <span />}
                    {file && !file.includes("[") && file.endsWith(".md") && (
                      <data.comp.CopyPage file={file} />
                    )}
                  </header>
                  <h1
                    className="leading-none md:text-4xl"
                    dangerouslySetInnerHTML={{
                      __html: helpers.md(data.title!, true),
                    }}
                  >
                  </h1>
                </div>
              )}
              {data.available_since && (
                <div class="bg-gray-200 rounded-md text-sm py-3 px-4 mb-4 font-semibold">
                  Available since {data.available_since}
                </div>
              )}
              {data.info && (
                <div class="admonition info">
                  <div class="title">Info</div>
                  <div
                    class="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: helpers.md(data.info, true),
                    }}
                  />
                </div>
              )}
              {data.children}
              {renderedCommand}
            </div>
            <div className="mt-24">
              {data.lastModified && !isReference && !isLintRule && (
                <p class="text-sm text-foreground-secondary mb-2 leading-none">
                  Last updated on{" "}
                  <time dateTime={data.lastModified.toISOString()}>
                    {data.lastModified.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </p>
              )}
              {(prevPage || nextPage) && (
                <nav
                  aria-label="Previous and next page"
                  class="flex justify-between gap-4 pt-4 border-t border-foreground-tertiary"
                >
                  {prevPage
                    ? (
                      <a
                        href={prevPage.href}
                        rel="prev"
                        class="no-underline hover:underline"
                      >
                        <span class="block text-xs text-foreground-secondary mb-1">
                          Previous
                        </span>
                        <span class="text-sm font-medium">
                          ← {prevPage.title}
                        </span>
                      </a>
                    )
                    : <span />}
                  {nextPage
                    ? (
                      <a
                        href={nextPage.href}
                        rel="next"
                        class="no-underline hover:underline text-right"
                      >
                        <span class="block text-xs text-foreground-secondary mb-1">
                          Next
                        </span>
                        <span class="text-sm font-medium">
                          {nextPage.title} →
                        </span>
                      </a>
                    )
                    : <span />}
                </nav>
              )}
            </div>
          </article>

          <data.comp.Feedback file={file} />
        </div>
      </main>
      {isReference && tocCtx && (
        <data.comp.RefToc
          documentNavigation={tocCtx.document_navigation}
          documentNavigationStr={tocCtx.document_navigation_str}
        />
      )}
    </>
  );
}

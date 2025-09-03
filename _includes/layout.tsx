export function deleteBackticks(str?: string) {
  return str?.replace(/`/g, "");
}

export default function Layout(data: Lume.Data) {
  const isReference = data.url.startsWith("/api/");
  const section = data.url.split("/").filter(Boolean)[0];
  const description = data.description ||
    "In-depth documentation, guides, and reference materials for building secure, high-performance JavaScript and TypeScript applications with Deno";
  const isServicesPage = data.url.startsWith("/deploy") ||
    data.url.startsWith("/subhosting") ||
    data.url.startsWith("/services");
  const hasSubNav = data.page?.data?.SidebarNav?.length ||
    data.url.startsWith("/api");

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{deleteBackticks(data.title)}</title>
        {data?.description &&
          <meta name="description" content={data.description} />}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script>
          const theme = localStorage.getItem('denoDocsTheme') ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' :
          'light'); document.documentElement.classList.add(theme);
        </script>

        <link rel="stylesheet" href="/style.css" />
        <link
          rel="preload"
          href="/fonts/inter/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="true"
        />
        <link
          rel="preload"
          href="/fonts/inter/Inter-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="true"
        />
        <link rel="me" href="https://fosstodon.org/@deno_land" />
        <data.comp.OpenGraph
          title={data.title}
          description={description}
          section={section}
          url={`https://docs.deno.com${data.url}`}
        />
        <meta
          name="keywords"
          content="Deno, JavaScript, TypeScript, reference, documentation, guide, tutorial, example"
        />
        <script type="module" defer src="/script.js"></script>
        <script type="module" defer src="/js/main.js"></script>
        <script type="module" defer src="/js/lint_rules.js"></script>
        <script type="module" defer src="/js/copy.js"></script>
        <script type="module" defer src="/js/tabs.js"></script>
        <script type="module" defer src="/js/feedback.js"></script>
        <script type="module" defer src="/js/search.js"></script>
        <script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5B5TH8ZJ"
        >
        </script>
        <link rel="preconnect" href="https://www.googletagmanager.com"></link>
      </head>
      <body
        data-services-page={Boolean(isServicesPage)}
      >
        <a
          href="#content"
          class="opacity-0 p-2 px-4 bg-background-secondary transition-transform duration-150 rounded-md ease-out absolute top-2 left-2 -translate-y-full focus:opacity-100 focus:translate-y-0 z-[500]"
        >
          Skip to main content
        </a>
        <data.comp.Header
          currentSection={section}
          currentUrl={data.url}
          data={data}
          hasSubNav={hasSubNav}
        />
        <div
          class={`layout ${
            data.toc?.length || isReference
              ? "layout--three-column"
              : "layout--two-column"
          }`}
        >
          <data.comp.Navigation
            data={data}
            currentSection={section}
            currentUrl={data.url}
            hasSubNav={hasSubNav}
          />
          {data.children}
          {!isReference && (
            <data.comp.TableOfContents
              toc={data.toc}
              data={data}
              hasSubNav={hasSubNav}
            />
          )}
        </div>
        <data.comp.Footer />
      </body>
    </html>
  );
}

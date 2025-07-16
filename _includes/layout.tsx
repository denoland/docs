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

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{deleteBackticks(data.title)}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const theme = localStorage.getItem('denoDocsTheme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.classList.add(theme);
            })();
          `,
          }}
        >
        </script>

        <link rel="stylesheet" href="/gfm.css" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/overrides.css" />
        <link rel="stylesheet" href="/components.css" />
        <script type="module" defer src="/components.js"></script>
        <script type="module" defer src="/lint_rules.client.js"></script>
        <script type="module" defer src="/copy.client.js"></script>
        <script type="module" defer src="/tabs.client.js"></script>
        <script type="module" defer src="/feedback.client.js"></script>
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
        />
        <data.comp.SubNav
          data={data}
          currentUrl={data.url}
        />
        <div
          class={`layout ${
            data.toc ? "layout--three-column" : "layout--two-column"
          }`}
        >
          <data.comp.Navigation
            data={data}
            currentSection={section}
            currentUrl={data.url}
          />
          {data.children}
          {!isReference && (
            <data.comp.TableOfContents toc={data.toc} data={data} />
          )}
        </div>
        <data.comp.Footer />
      </body>
    </html>
  );
}

export default function Layout(data: Lume.Data) {
  const section = data.url.split("/").filter(Boolean)[0];
  const description = data.description ||
    "In-depth documentation, guides, and reference materials for building secure, high-performance JavaScript and TypeScript applications with Deno";

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{data.title}</title>
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

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@deno_land" />
        <link rel="me" href="https://fosstodon.org/@deno_land" />
        <meta name="twitter:title" content={data.title} />
        <meta property="og:title" content={data.title} />

        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="description" content={description} />

        <meta name="twitter:image" content="/img/og.webp" />
        <meta
          name="twitter:image:alt"
          content="Deno docs: Deno documentation, guides, and reference materials. docs.deno.com"
        />
        <meta property="og:image" content="/img/og.webp" />
        <meta
          property="og:image:alt"
          content="Deno docs: Deno documentation, guides, and reference materials. docs.deno.com"
        />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Deno" />
        <meta property="og:locale" content="en_US" />

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
        <link rel="stylesheet" href="/style.css" />
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
      <body>
        <data.comp.Header currentSection={section} />
        <data.comp.RefHeader currentUrl={data.url} />
        <div className="layout">
          <data.comp.Navigation
            data={data}
            currentSection={section}
            currentUrl={data.url}
          />
          {data.children}
          <data.comp.Footer />
        </div>
      </body>
    </html>
  );
}

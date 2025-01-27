import Header from "../_components/Header.tsx";

export default function Layout(props: Lume.Data) {
  const reference = props.url.startsWith("/api");
  const description = props.description ||
    "In-depth documentation, guides, and reference materials for building secure, high-performance JavaScript and TypeScript applications with Deno";

  return (
    <html
      lang="en"
      class={`light ${reference ? "" : "h-dvh"}`}
    >
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
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
        <meta name="twitter:title" content={props.title} />
        <meta property="og:title" content={props.title} />

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

        <link rel="stylesheet" href="/gfm.css" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/overrides.css" />
        <script src="/darkmode.client.js"></script>
        <script type="module" src="/darkmode-toggle.client.js"></script>
        <script type="module" src="/sidebar.client.js"></script>
        <script type="module" src="/lint_rules.client.js"></script>
        <script type="module" src="/copy.client.js"></script>
        <script type="module" src="/tabs.client.js"></script>
        <script type="module" src="/feedback.client.js"></script>
        <script type="module" src="/youtube-lite.client.js"></script>
        <script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5B5TH8ZJ"
        >
        </script>
        <link rel="preconnect" href="https://www.googletagmanager.com"></link>
        <script>
          {/*js*/ `
          /* Without this, @media theme preference will override manual theme selection, if different. A little janky but works ok for now, especially since it's just the one edge case where a user's global preference doesn't match their chosen docs theme preference */
          window.onload = () => {
            const colorThemes = document.querySelectorAll('[data-color-mode]');
            const ps = document.querySelectorAll('p');
            colorThemes.forEach((el) => {
              el.setAttribute('data-color-mode', localStorage.denoDocsTheme || 'auto');
            });
          }`}
        </script>
      </head>
      <body
        class={`bg-background-primary text-foreground-primary ${
          reference ? "" : "h-dvh"
        }`}
      >
        <a
          href="#content"
          class="opacity-0 absolute top-2 left-2 p-2 border -translate-y-12 transition-all focus:translate-y-0 focus:opacity-100 z-50 bg-background-primary font-bold"
        >
          Skip to main content <span aria-hidden="true">-&gt;</span>
        </a>
        <Header url={props.url} hasSidebar={!!props.sidebar} />
        {props.children}
      </body>
    </html>
  );
}

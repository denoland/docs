export default function Layout(props: Lume.Data) {
  const reference = props.url.startsWith("/api");

  return (
    <html lang="en" class={reference ? "" : "h-dvh"}>
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
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/gfm.css" />
        <link rel="stylesheet" href="/overrides.css" />
        <script src="/orama-searchbox-1.0.0-rc47.js" defer></script>
        <script type="module" src="/sidebar.client.js"></script>
        <script type="module" src="/copy.client.js"></script>
        <script type="module" src="/search.client.js"></script>
        <script type="module" src="/tabs.client.js"></script>
        <script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5B5TH8ZJ"
        >
        </script>
        <link rel="preconnect" href="https://www.googletagmanager.com"></link>
      </head>
      <body class={reference ? "" : "h-dvh"}>
        <props.comp.Header url={props.url} hasSidebar={!!props.sidebar} />
        {props.children}
      </body>
    </html>
  );
}

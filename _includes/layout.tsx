export default function Layout(props: Lume.Data) {
  return (
    <html lang="en">
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
        <script type="module" src="/sidebar.client.js" defer inline></script>
      </head>
      <body>
        <props.comp.Header url={props.url} />
        {props.children}
      </body>
    </html>
  );
}

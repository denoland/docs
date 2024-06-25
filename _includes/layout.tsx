export default function Layout(props: Lume.Data) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        <link rel="stylesheet" href="/styles.css" />
        <script type="module" src="/sidebar.client.js" defer inline></script>
      </head>
      <body>
        <props.comp.Header />
        {props.children}
      </body>
    </html>
  );
}

export default (
  { title, children, comp }: Lume.Data,
) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/components.css" />
      <script type="module" src="/components.js"></script>

      <title>{title}</title>
    </head>
    <body>
      <comp.Header_new />
      <comp.Navigation />
      <main>
        {children}
      </main>
      <comp.Footer_new />
    </body>
  </html>
);

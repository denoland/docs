export default (
  { title, children, comp }: Lume.Data, helpers: Lume.Helpers) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/components.css" />
      <title>{title}</title>
    </head>
    <body class="light">
      <comp.Header_new />
      {children}
      <comp.Button>Click me!</comp.Button>
      <comp.Footer_new />
    </body>
  </html>
);

export default (data: Lume.Data) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/components.css" />
      <script type="module" src="/components.js"></script>

      <title>{data.title}</title>
    </head>
    <body>
      <h1>{data.url}</h1>
      <data.comp.Header_new currentUrl={data.url} />
      <data.comp.Navigation currentUrl={data.url}  />
      <main>
        {data.children}
      </main>
      <data.comp.Footer_new />
    </body>
  </html>
);

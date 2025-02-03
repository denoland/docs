export default (
  { title, children, comp }: Lume.Data,
  helpers: Lume.Helpers,
) => (
  <html>
    <head>
      <title>{title}</title>
    </head>
    <body>
      {children}
      <comp.Button>Click me!</comp.Button>
    </body>
  </html>
);

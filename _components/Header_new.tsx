export const css = `
nav {
  display: none;
}

@media screen and (min-width: var(--viewport-small)) {
  nav {
    display: flex;
  }
}

header {
  background-color: red;
}
`;

export default function (data: Lume.Data, helpers: Lume.Helpers) {
  return (
    <header>
      <a href="/">Deno Docs</a>
      <nav>
        <a href="/runtime/">Manual</a>
        <a href="/api/">API reference</a>
        <a href="/examples/">Examples</a>
        <a href="/deploy/manual/">About</a>
        <a href="/subhosting/manual/">Subhosting</a>
      </nav>
      <a href="https://deno.com" className="external">deno.com</a>
      <data.comp.SearchInput />
      <data.comp.ThemeToggle />
    </header>
  );
}

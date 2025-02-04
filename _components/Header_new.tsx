export const css = `
header {
  position: sticky;
  top: 0;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid var(--foreground-tertiary);
}

nav {
  display: none;
}

.external {
  margin-left: auto;
}
  
@media (min-width:650px) {
  nav {
    display: flex;
  }
}
      
.logo-link {
  margin-right: auto;
}

.logo {
  display: block;
  height: 2.3rem;
}
`;

export default function (data: Lume.Data, helpers: Lume.Helpers) {
  return (
    <header>
      <a href="/" title="Deno docs home" className="logo-link">
        <data.comp.Logo />
      </a>
      <nav>
        <a href="/runtime/">Manual</a>
        <a href="/api/">API reference</a>
        <a href="/examples/">Examples</a>
        <a href="/deploy/manual/">About</a>
        <a href="/subhosting/manual/">Subhosting</a>
      </nav>
      <data.comp.ExternalLink url="https://deno.com">
        deno.com
      </data.comp.ExternalLink>
      <data.comp.SearchInput />
      <data.comp.ThemeToggle />
    </header>
  );
}

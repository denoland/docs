export default function (data: Lume.Data) {
  return (
    <header>
      <h1>Deno documentation</h1>
      <a href="/" title="Deno docs home" className="logo-link">
        <data.comp.Logo />
      </a>
      <nav>
        <a href="/runtime/" className="header-nav-link">Manual</a>
        <a href="/api/" className="header-nav-link">API reference</a>
        <a href="/examples/" className="header-nav-link">Examples</a>
        <a href="/deploy/manual/" className="header-nav-link">About</a>
        <a href="/subhosting/manual/" className="header-nav-link">Subhosting</a>
      </nav>
      <data.comp.ExternalLink url="https://deno.com">
        deno.com
      </data.comp.ExternalLink>
      <data.comp.SearchInput />
      <data.comp.ThemeToggle />
    </header>
  );
}

export const css = "@import './_components/Header_new.css';";

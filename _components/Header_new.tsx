import { styledComponent } from "../_plugins/cssHotReload.ts";

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

export const css = styledComponent(import.meta.url);

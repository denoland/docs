export const layout = "doc.tsx";

export interface LandingTile {
  title: string;
  href: string;
  description: string | null;
}

export interface LandingSection {
  key: string;
  title: string;
  description: string;
  href: string;
  allSymbolsHref: string;
  tiles: LandingTile[];
  /** Render tiles in a denser grid (used for the long Node module list). */
  dense?: boolean;
}

export interface LandingData {
  intro: string;
  sections: LandingSection[];
}

/** The /api/ hub: every API group presented as a tile grid, generated from
 * the same grouping data as the reference pages themselves. */
export default function ApiLanding(
  { data }: { data: LandingData } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return (
    <main
      id="content"
      className="ddoc markdown-body"
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      <h1>API reference</h1>
      <p className="max-w-prose text-foreground-secondary">{data.intro}</p>

      {data.sections.map((section) => (
        <section key={section.key} className="mt-10">
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="!mb-0 !border-0">
              <a href={section.href} className="!text-foreground-primary">
                {section.title}
              </a>
            </h2>
            <a
              className="text-sm whitespace-nowrap"
              href={section.allSymbolsHref}
            >
              View all symbols <span aria-hidden="true">-&gt;</span>
            </a>
          </header>
          <p className="mt-2 max-w-prose text-foreground-secondary">
            {section.description}
          </p>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 ${
              section.dense ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {section.tiles.map((tile) => (
              <a
                key={tile.href}
                href={tile.href}
                className="group flex flex-col gap-1 p-4 rounded-lg border border-foreground-tertiary !no-underline hover:border-primary transition-colors duration-150"
              >
                <span className="font-semibold !text-foreground-primary group-hover:underline underline-offset-4 decoration-primary">
                  {tile.title}
                </span>
                {tile.description && (
                  <span className="text-sm text-foreground-secondary">
                    {tile.description}
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

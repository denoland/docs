import { SecondaryNav } from "../types.ts";

export default function (
  { data, currentUrl }: {
    data: Lume.Data;
    currentUrl: string;
  },
) {
  let navData = data.page?.data?.secondaryNav;
  const isReference = currentUrl.startsWith("/api");
  const apiReferenceSubnavItems = [
    {
      title: "Deno APIs",
      href: "/api/deno",
    },
    {
      title: "Web APIs",
      href: "/api/web",
    },
    {
      title: "Node APIs",
      href: "/api/node",
    },
  ] satisfies SecondaryNav;

  // We need to hard-code the API Reference subnav, since it's generated elsewhere.
  if (isReference && !navData) navData = apiReferenceSubnavItems;

  if (!navData || navData.length === 0) {
    return null;
  }

  return (
    <nav class="refheader">
      <ul class="flex w-full max-w-7xl mx-auto items-center gap-6">
        {navData.map((nav: any) => (
          <li key={nav.href}>
            <a
              className="refheader-link"
              data-active={currentUrl.includes(nav.href)}
              href={nav.href}
            >
              {typeof nav.title === "string"
                ? <span dangerouslySetInnerHTML={{ __html: nav.title }}></span>
                : nav.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export const css = "@import './_components/SubNav.css';";

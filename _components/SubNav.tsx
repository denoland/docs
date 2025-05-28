export default function (
  { data, currentUrl }: {
    data: Lume.Data;
    currentUrl: string;
  },
) {
  const navData = data.page?.data?.secondaryNav;
  if (!navData || navData.length === 0) {
    return null;
  }

  return (
    <nav class="refheader">
      <ul class="flex">
        {navData.map((nav: any) => (
          <li key={nav.href}>
            <a
              class="blocklink refheader-link"
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

export const css = "@import './_components/RefHeader.css';";

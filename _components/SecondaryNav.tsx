export default function (data: Lume.Data) {
  const sectionData = data.sectionData;
  const currentUrl = data.currentUrl;
  const isReference = currentUrl.startsWith("/api/");

  // Reference page nav has no heirarchy and a different data names
  if (isReference) {
    return (
      <>
        {sectionData.map((nav: any) => (
          <nav aria-labelledby="section-navigation">
            <ul className="sub-nav">
              {nav.items?.map((item: any) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="sub-nav-link blocklink"
                    data-active={item.active}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </>
    );
  }

  // Navigation for rest of site
  return (
    <>
      {sectionData.map((nav: any) => (
        <nav aria-labelledby="section-navigation">
          <h2 className="sub-nav-heading">
            {nav.href && nav.href.length > 0
              ? (
                <a
                  href={nav.href}
                  className="sub-nav-heading-link"
                  data-active={nav.href === currentUrl}
                >
                  {nav.title}
                </a>
              )
              : (
                <span className="sub-nav-heading-text">
                  {nav.title}
                </span>
              )}
          </h2>

          <ul className="sub-nav">
            {nav.items?.map((item: any) => (
              <li key={item.href}>
                {item.items && item.items.length > 0
                  ? (
                    <>
                      <label
                        htmlFor={`sub-nav-toggle-${
                          item.title.replaceAll(" ", "")
                        }`}
                        className="sub-nav-toggle blocklink"
                      >
                        {item.title}
                      </label>
                      <input
                        type="checkbox"
                        id={`sub-nav-toggle-${item.title.replaceAll(" ", "")}`}
                        className="sub-nav-toggle-checkbox"
                      />
                      <ul className="sub-nav tertiary-nav">
                        {item.items.map((subItem: any) => (
                          <li key={subItem.href}>
                            <a
                              href={subItem.href}
                              className="sub-nav-link blocklink"
                              data-active={subItem.href === currentUrl}
                            >
                              {subItem.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )
                  : (
                    <a
                      href={item.href}
                      className="sub-nav-link blocklink"
                      data-active={item.href === currentUrl}
                    >
                      {item.title}
                    </a>
                  )}
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </>
  );
}

export const css = "@import './_components/SecondaryNav.css';";

export const js = `import "/js/nav-toggle.client.js";`;

export default function (data: Lume.Data) {
  const sectionData = data.sectionData;
  const currentUrl = data.currentUrl;

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
                  data-active={nav.href === currentUrl || nav.active}
                >
                  {nav.title || nav.name}
                </a>
              )
              : (
                <span className="sub-nav-heading-text">
                  {nav.title || nav.name}
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
                        htmlFor={`sub-nav-toggle-${item.href}`}
                        className="sub-nav-toggle blocklink"
                      >
                        {item.title || item.name}
                      </label>
                      <input
                        type="checkbox"
                        id={`sub-nav-toggle-${item.href}`}
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
                              {subItem.title || subItem.name}
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
                      {item.title || item.name}
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

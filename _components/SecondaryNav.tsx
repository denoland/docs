export default function (data: Lume.Data) {
  const sectionData = data.sectionData;
  const currentUrl = data.currentUrl.replace(/\/$/, "");
  const isReference = currentUrl.startsWith("/api/");
  const isDenoAPI = currentUrl.startsWith("/api/deno/");

  if (isReference) {
    return (
      <>
        {sectionData.map((nav: any) => (
          <nav>
            <SidebarList>
              {nav.items?.map((item: any) => (
                <li key={item.href}>
                  {(isDenoAPI && item.name === "Uncategorized")
                    ? null
                    : (
                      <SidebarItem
                        href={item.href}
                        title={item.name}
                        isActive={item.active}
                      />
                    )}
                </li>
              ))}
            </SidebarList>
          </nav>
        ))}
      </>
    );
  }

  // Navigation for rest of site
  return (
    <>
      {sectionData.map((nav: any) => (
        <nav>
          <SidebarCategoryHeading
            href={nav.href}
            title={nav.title}
            isActive={nav.href && nav.href.replace(/\/$/, "") === currentUrl}
          />
          {nav.items && Array.isArray(nav.items) && nav.items.length > 0 && (
            <SidebarList>
              {nav.items?.map((item: any) => (
                <li key={item.href}>
                  {item.items && item.items.length > 0
                    ? (
                      <>
                        <label
                          htmlFor={`sub-nav-toggle-${
                            item.title.replaceAll(" ", "")
                          }`}
                          className="sub-nav-toggle"
                        >
                          {item.title}
                          <input
                            type="checkbox"
                            id={`sub-nav-toggle-${
                              item.title.replaceAll(" ", "")
                            }`}
                            className="sub-nav-toggle-checkbox sr-only"
                          />
                        </label>
                        <SidebarList>
                          {item.items.map((subItem: any) => (
                            <li key={subItem.href}>
                              <SidebarItem
                                title={subItem.title}
                                href={subItem.href}
                                isActive={subItem.href.replace(/\/$/, "") ===
                                  currentUrl}
                              />
                            </li>
                          ))}
                        </SidebarList>
                      </>
                    )
                    : (
                      <SidebarItem
                        href={item.href}
                        title={item.title}
                        isActive={item.href.replace(/\/$/, "") === currentUrl}
                      />
                    )}
                </li>
              ))}
            </SidebarList>
          )}
        </nav>
      ))}
    </>
  );
}

function SidebarList(props: { children: Element; className?: string }) {
  return (
    <ul
      className={`p-0 m-0 list-none overflow-y-hidden ${props.className ?? ""}`}
    >
      {props.children}
    </ul>
  );
}

function SidebarItem(props: {
  title: string;
  href: string;
  isActive?: boolean;
}) {
  const defaultClasses =
    "block m-0 py-1 px-3 border-l hover:bg-header-highlight hover:border-foreground-secondary hover:text-gray-800";
  const activeClasses = props.isActive
    ? "bg-header-highlight border-foreground-secondary text-gray-800"
    : "border-foreground-tertiary";

  const combinedClasses = `${defaultClasses} ${activeClasses}`;

  return (
    <a
      href={props.href}
      className={combinedClasses}
      data-active={props.isActive}
    >
      {props.title}
    </a>
  );
}

function SidebarCategoryHeading(props: {
  title: string;
  href?: string;
  isActive?: boolean;
}) {
  const defaultClasses =
    "block uppercase py-2 px-0 mt-4 text-foreground-secondary font-bold leading-none tracking-wide !border-0";
  return (
    <h2>
      {props.href && props.href.length > 0
        ? (
          <a
            href={props.href}
            className={`${defaultClasses} hover:text-foreground-primary`}
            data-active={props.isActive}
          >
            {props.title}
          </a>
        )
        : (
          <div className={defaultClasses}>
            {props.title}
          </div>
        )}
    </h2>
  );
}

export const css = "@import './_components/SecondaryNav.css';";

export const js = `import "/js/nav-toggle.client.js";`;

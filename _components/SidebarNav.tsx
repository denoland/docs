// deno-lint-ignore-file no-explicit-any
export default function (data: Lume.Data) {
  const sectionData = data.sectionData;
  const currentUrl = data.currentUrl.replace(/\/$/, "");
  const isReference = currentUrl.startsWith("/api/");

  // Access global API categories data
  const apiCategories = data.apiCategories;

  if (isReference) {
    // Note: Per-category symbol counts are not available in the generated API data structure
    // The categories_panel only provides total symbol counts, not per-category breakdowns
    // For API reference, we want to add section headings for the three API types

    const apiSections = [
      {
        title: "Deno APIs",
        key: "deno",
        isCurrentSection: currentUrl.startsWith("/api/deno"),
        items: currentUrl.startsWith("/api/deno") ? sectionData : undefined,
        extraItems: [
          { href: "/api/deno", title: "Deno specific APIs" },
          {
            href: "/api/deno/all_symbols",
            title: "All symbols",
          },
        ],
      },
      {
        title: "Web APIs",
        key: "web",
        isCurrentSection: currentUrl.startsWith("/api/web"),
        items: currentUrl.startsWith("/api/web") ? sectionData : undefined,
        extraItems: [
          { href: "/api/web", title: "Web Platform Support" },
          {
            href: "/api/web/all_symbols",
            title: "All symbols",
          },
        ],
      },
      {
        title: "Node APIs",
        key: "node",
        isCurrentSection: currentUrl.startsWith("/api/node"),
        items: currentUrl.startsWith("/api/node") ? sectionData : undefined,
        extraItems: [
          { href: "/api/node", title: "Node support in deno" },
          {
            href: "/api/node/all_symbols",
            title: "All symbols",
          },
        ],
      },
    ];

    return (
      <>
        {apiSections.map((section) => (
          <nav key={section.key}>
            <SidebarCategoryHeading
              title={section.title}
            />
            <SidebarList>
              {/* Add extra items first */}
              {section.extraItems.map((extraItem) => (
                <li key={extraItem.href}>
                  <SidebarItem
                    href={extraItem.href}
                    title={extraItem.title}
                    isActive={extraItem.href.replace(/\/$/, "") ===
                      currentUrl}
                  />
                </li>
              ))}

              {/* Add collapsible sections for all API types - always visible */}
              {section.key === "deno" && (
                <li>
                  <label
                    htmlFor="sub-nav-toggle-DenoAPIs"
                    className="sub-nav-toggle block relative py-1 px-3 after:right-4 [font:inherit] after:translate-y-1/2 after:transition-transfor after:duration-100 after:ease-in after:[background:url(./img/chevron.svg)_no-repeat_center] after:-top-0.5 after:block after:w-4 after:h-4 after:absolute"
                  >
                    Deno APIs by category
                    <input
                      type="checkbox"
                      id="sub-nav-toggle-DenoAPIs"
                      className="sub-nav-toggle-checkbox sr-only"
                    />
                  </label>
                  <SidebarList>
                    {section.items
                      ? section.items.map((nav: any) =>
                        nav.items?.map((item: any) => {
                          const groupedItems =
                            apiCategories?.deno?.categories || [];

                          if (item.name === "Uncategorized") {
                            return null;
                          }

                          if (groupedItems.includes(item.name)) {
                            return (
                              <li key={item.href}>
                                <SidebarItem
                                  href={item.href}
                                  title={item.name}
                                  isActive={item.active}
                                />
                              </li>
                            );
                          }
                          return null;
                        })
                      )
                      : (
                        // Show static list when not on Deno API page
                        (apiCategories?.deno?.categories || []).map((
                          categoryName: string,
                        ) => (
                          <li key={categoryName}>
                            <SidebarItem
                              href={apiCategories?.deno?.getCategoryHref?.(
                                categoryName,
                              ) ||
                                `/api/deno/category-${
                                  categoryName.toLowerCase().replace(
                                    /\s+/g,
                                    "-",
                                  )
                                }/`}
                              title={categoryName}
                              isActive={false}
                            />
                          </li>
                        ))
                      )}
                  </SidebarList>
                </li>
              )}

              {section.key === "web" && (
                <li>
                  <label
                    htmlFor="sub-nav-toggle-WebAPIs"
                    className="sub-nav-toggle block relative py-1 px-3 after:right-4 [font:inherit] after:translate-y-1/2 after:transition-transfor after:duration-100 after:ease-in after:[background:url(./img/chevron.svg)_no-repeat_center] after:-top-0.5 after:block after:w-4 after:h-4 after:absolute"
                  >
                    Web APIs by category
                    <input
                      type="checkbox"
                      id="sub-nav-toggle-WebAPIs"
                      className="sub-nav-toggle-checkbox sr-only"
                    />
                  </label>
                  <SidebarList>
                    {section.items
                      ? section.items.map((nav: any) =>
                        nav.items?.map((item: any) => (
                          <li key={item.href}>
                            <SidebarItem
                              href={item.href}
                              title={item.name}
                              isActive={item.active}
                            />
                          </li>
                        ))
                      )
                      : (
                        // Show static list when not on Web API page
                        (apiCategories?.web?.categories || []).map((
                          categoryName: string,
                        ) => (
                          <li key={categoryName}>
                            <SidebarItem
                              href={apiCategories?.web?.getCategoryHref?.(
                                categoryName,
                              ) ||
                                `/api/web/category-${
                                  categoryName.toLowerCase().replace(
                                    /\s+/g,
                                    "-",
                                  )
                                }/`}
                              title={categoryName}
                              isActive={false}
                            />
                          </li>
                        ))
                      )}
                  </SidebarList>
                </li>
              )}

              {section.key === "node" && (
                <li>
                  <label
                    htmlFor="sub-nav-toggle-NodeAPIs"
                    className="sub-nav-toggle block relative py-1 px-3 after:right-4 [font:inherit] after:translate-y-1/2 after:transition-transfor after:duration-100 after:ease-in after:[background:url(./img/chevron.svg)_no-repeat_center] after:-top-0.5 after:block after:w-4 after:h-4 after:absolute"
                  >
                    Node APIs by namespace
                    <input
                      type="checkbox"
                      id="sub-nav-toggle-NodeAPIs"
                      className="sub-nav-toggle-checkbox sr-only"
                    />
                  </label>
                  <SidebarList>
                    {section.items
                      ? section.items.map((nav: any) =>
                        nav.items?.map((item: any) => (
                          <li key={item.href}>
                            <SidebarItem
                              href={item.href}
                              title={item.name}
                              isActive={item.active}
                            />
                          </li>
                        ))
                      )
                      : (
                        // Show static list when not on Node API page
                        (apiCategories?.node?.categories || []).map((
                          categoryName: string,
                        ) => (
                          <li key={categoryName}>
                            <SidebarItem
                              href={apiCategories?.node?.getCategoryHref?.(
                                categoryName,
                              ) ||
                                `/api/node/${categoryName}/`}
                              title={categoryName}
                              isActive={false}
                            />
                          </li>
                        ))
                      )}
                  </SidebarList>
                </li>
              )}
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
        <nav key={nav.href || nav.title}>
          <SidebarCategoryHeading
            href={nav.href}
            title={nav.title}
            isActive={Boolean(
              nav.href && nav.href.replace(/\/$/, "") === currentUrl,
            )}
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
                          className="sub-nav-toggle block relative py-1 px-3 after:right-4 [font:inherit] after:translate-y-1/2 after:transition-transfor after:duration-100 after:ease-in after:[background:url(./img/chevron.svg)_no-repeat_center] after:-top-0.5 after:block after:w-4 after:h-4 after:absolute"
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

function SidebarList(
  props: { children: any; className?: string },
) {
  return (
    <ul
      className={`p-0 list-none overflow-y-hidden ${props.className ?? ""}`}
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
    "block m-0 py-1 px-3 border-l hover:bg-header-highlight hover:border-foreground-secondary hover:text-gray-800 transition-colors duration-150";
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
  if (props.href) {
    return (
      <h2 class="block uppercase py-2 pr-4 mt-4 !border-0">
        <a
          href={props.href}
          className={`text-foreground-secondary font-bold leading-none tracking-wide hover:text-primary transition-colors ${
            props.isActive ? "text-primary" : ""
          }`}
        >
          {props.title}
        </a>
      </h2>
    );
  }

  return (
    <h2 class="block uppercase py-2 pr-4 mt-4 text-foreground-secondary font-bold leading-[1.2] text-balance tracking-wide !border-0">
      {props.title}
    </h2>
  );
}

export const js = `import "/js/sidebar.client.js";`;

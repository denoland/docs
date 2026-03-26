// deno-lint-ignore-file no-explicit-any
import ReferenceSidebarNav from "../../reference/_components/ReferenceSidebarNav.tsx";

export default function (data: Lume.Data) {
  const sectionData = data.sectionData;
  const currentUrl = data.currentUrl.replace(/\/$/, "");
  const isReference = currentUrl.startsWith("/api/");

  if (isReference) {
    return <ReferenceSidebarNav {...data} />;
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
                        <button
                          type="button"
                          data-accordion-toggle={item.title.replaceAll(" ", "")}
                          className="sub-nav-toggle block relative py-1 px-3 after:right-4 [font:inherit] after:translate-y-1/2 after:transition-transform after:duration-100 after:ease-in after:[background:url(./img/chevron.svg)_no-repeat_center] after:-top-0.5 after:block after:w-4 after:h-4 after:absolute w-full text-left"
                        >
                          {item.title}
                        </button>
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

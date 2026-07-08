// deno-lint-ignore-file no-explicit-any
import ReferenceSidebarNav from "../../reference/_components/ReferenceSidebarNav.tsx";

export default function (data: Lume.Data) {
  const sectionData = data.sectionData;
  const currentUrl = data.currentUrl.replace(/\/$/, "");
  const isReference = currentUrl === "/api" || currentUrl.startsWith("/api/");

  if (isReference) {
    return <ReferenceSidebarNav {...data} />;
  }

  // Navigation for rest of site
  return (
    <>
      {sectionData.map((nav: any) => (
        <nav key={nav.href || nav.title} className="mb-4">
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
                  {item.items && item.items.length > 0 && item.disclosure
                    ? <SidebarDisclosure item={item} currentUrl={currentUrl} />
                    : item.items && item.items.length > 0
                    ? (
                      <>
                        <button
                          type="button"
                          data-accordion-toggle={item.title.replaceAll(" ", "")}
                          className="sub-nav-toggle block relative py-1.5 px-3 after:right-4 [font:inherit] after:translate-y-1/2 after:transition-transform after:duration-100 after:ease-in after:[background:url(./img/chevron.svg)_no-repeat_center] after:-top-0.5 after:block after:w-4 after:h-4 after:absolute w-full text-left"
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
                                nested
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

// Opt-in (item.disclosure = true in a section's _data.ts) group pattern for
// sections whose group item has its own landing page: the label is a normal
// link and a separate chevron button toggles the children. Groups that do
// not opt in keep the existing accordion above, untouched. The active
// trail's open state is rendered on the server, so there is no expand flash.
function SidebarDisclosure(
  props: { item: any; currentUrl: string },
) {
  const { item, currentUrl } = props;
  const groupId = `sidebar-group-${
    String(item.href || item.title).replace(/[^a-zA-Z0-9]+/g, "-").replace(
      /^-|-$/g,
      "",
    ).toLowerCase()
  }`;
  const selfActive = Boolean(
    item.href && item.href.replace(/\/$/, "") === currentUrl,
  );
  const childActive = item.items.some(
    (sub: any) => sub.href && sub.href.replace(/\/$/, "") === currentUrl,
  );
  const open = selfActive || childActive;

  const chevron = (
    <svg
      class="sidebar-disclosure-chevron"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      width="14"
      height="14"
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  return (
    <div class="sidebar-disclosure" data-disclosure data-open={String(open)}>
      <div class="sidebar-disclosure-row flex items-stretch">
        <a
          href={item.href}
          className={`grow block m-0 py-1.5 px-3 border-l hover:bg-header-highlight hover:border-foreground-secondary hover:text-gray-800 transition-colors duration-150 ${
            selfActive
              ? "bg-header-highlight text-gray-800 border-foreground-secondary"
              : "border-sidebar-line"
          }`}
          data-active={selfActive}
        >
          {item.title}
        </a>
        <button
          type="button"
          class="sidebar-disclosure-btn"
          data-disclosure-toggle
          aria-expanded={String(open)}
          aria-controls={groupId}
          aria-label={`Toggle ${item.title} pages`}
        >
          {chevron}
        </button>
      </div>
      <ul
        id={groupId}
        class="sidebar-disclosure-list p-0 list-none"
        hidden={!open}
      >
        {item.items.map((subItem: any) => (
          <li key={subItem.href}>
            <SidebarItem
              title={subItem.title}
              href={subItem.href}
              isActive={subItem.href.replace(/\/$/, "") === currentUrl}
              nested
            />
          </li>
        ))}
      </ul>
    </div>
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
  nested?: boolean;
}) {
  // Nested items (e.g. under "Standard library") are denser and rely on the
  // parent group's single guide line instead of carrying their own left border.
  const defaultClasses = props.nested
    ? "block m-0 py-1 px-3 hover:bg-header-highlight hover:text-gray-800 transition-colors duration-150"
    : "block m-0 py-1.5 px-3 border-l hover:bg-header-highlight hover:border-foreground-secondary hover:text-gray-800 transition-colors duration-150";
  const activeClasses = props.isActive
    ? `bg-header-highlight text-gray-800${
      props.nested ? "" : " border-foreground-secondary"
    }`
    : props.nested
    ? ""
    : "border-sidebar-line";

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
      <h2 className="block leading-0 uppercase pb-3 pt-1.5 pr-4 border-0!">
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
    <h2 className="block leading-0 uppercase pb-3 pt-1.5 pr-4 text-foreground-secondary font-bold text-balance tracking-wide border-0!">
      {props.title}
    </h2>
  );
}

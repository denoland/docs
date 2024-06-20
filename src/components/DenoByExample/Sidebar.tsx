export default function Sidebar({ examplesList }) {
  const listElements = examplesList.map((example) => {
    return (
      <li
        key={example.id}
        className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item"
      >
        <a
          href={"/" + example.id}
          className="menu__link menu__link--active"
          aria-current="page"
        >
          {example.label}
        </a>
      </li>
    );
  });

  return (
    <aside className="theme-doc-sidebar-container docSidebarContainer_node_modules-@docusaurus-theme-classNameic-lib-theme-DocRoot-Layout-Sidebar-styles-module">
      <div className="sidebarViewport_node_modules-@docusaurus-theme-classNameic-lib-theme-DocRoot-Layout-Sidebar-styles-module">
        <div className="sidebar_node_modules-@docusaurus-theme-classNameic-lib-theme-DocSidebar-Desktop-styles-module">
          <nav
            aria-label="Docs sidebar"
            className="menu thin-scrollbar menu_node_modules-@docusaurus-theme-classNameic-lib-theme-DocSidebar-Desktop-Content-styles-module"
          >
            <ul className="theme-doc-sidebar-menu menu__list">
              <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 section-header">
                <div>Getting Started</div>
              </li>
              {listElements}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}

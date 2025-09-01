const mainNav = document.querySelector("#main-nav");

if (mainNav) {
  const currentNavItem = mainNav?.querySelector("a[data-active]");
  const currentNavItemHighlighter = document.querySelector(
    "#current-nav-item",
  ) as HTMLElement;

  if (currentNavItem && currentNavItemHighlighter) {
    mainNav.addEventListener(
      "mouseover",
      (e) => {
        if (e.target === e.currentTarget) return;
        requestAnimationFrame(() => {
          const target = e.target as HTMLElement;
          const defaultLeft = currentNavItem?.getBoundingClientRect()?.left;
          const defaultScaleX = currentNavItem?.getBoundingClientRect()?.width;
          if (target === currentNavItem) {
            currentNavItemHighlighter.style.setProperty("--left", "0px");
            currentNavItemHighlighter.style.setProperty("--scaleX", "1");
          } else if (currentNavItem && defaultLeft && defaultScaleX) {
            currentNavItemHighlighter.style.setProperty(
              "--left",
              `${target.getBoundingClientRect().left - defaultLeft}px`,
            );
            currentNavItemHighlighter.style.setProperty(
              "--scaleX",
              `${target.offsetWidth / defaultScaleX}`,
            );
          }
        });
      },
    );

    mainNav.addEventListener("mouseout", () => {
      currentNavItemHighlighter.style.setProperty("--left", "0px");
      currentNavItemHighlighter.style.setProperty("--scaleX", "1");
    });
  }
}

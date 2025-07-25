import throttle from "npm:just-throttle@4.2.0";

const mainNav = document.querySelector("#main-nav");

if (mainNav) {
  const currentNavItem = mainNav?.querySelector("a[data-active]");
  const currentNavItemHighlighter = document.querySelector(
    "#current-nav-item",
  ) as HTMLElement;

  mainNav.addEventListener(
    "mouseover",
    throttle((e) => {
      if (e.target === e.currentTarget) return;
      const target = e.target as HTMLElement;
      const defaultLeft = currentNavItem?.getBoundingClientRect().left;
      const defaultScaleX = currentNavItem?.getBoundingClientRect().width!;
      if (e.target === currentNavItem) {
        currentNavItemHighlighter.style.setProperty("--left", "0px");
        currentNavItemHighlighter.style.setProperty("--scaleX", "1");
      } else {
        currentNavItemHighlighter.style.setProperty(
          "--left",
          `${target.getBoundingClientRect().left - defaultLeft}px`,
        );
        currentNavItemHighlighter.style.setProperty(
          "--scaleX",
          `${target.offsetWidth / defaultScaleX}`,
        );
      }
    }, 50),
  );

  mainNav.addEventListener("mouseout", () => {
    currentNavItemHighlighter.style.setProperty("--left", "0px");
    currentNavItemHighlighter.style.setProperty("--scaleX", "1");
  });
}

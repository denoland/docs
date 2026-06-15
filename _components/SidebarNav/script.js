const sidebar = document.getElementById("nav");
const button = document.getElementById("hamburger-button");

if (sidebar) {
  const toggleButtons = document.querySelectorAll(
    ".sub-nav-toggle[data-accordion-toggle]",
  );

  toggleButtons.forEach((toggleButton) => {
    const accordionId = toggleButton.getAttribute("data-accordion-toggle");
    const parentLi = toggleButton.closest("li");

    // Set initial state from localStorage without animation
    const isExpanded =
      localStorage.getItem(`accordion-${accordionId}`) === "true";
    if (parentLi) {
      if (isExpanded) {
        parentLi.classList.add("expanded");
        toggleButton.setAttribute("aria-expanded", "true");
      } else {
        toggleButton.setAttribute("aria-expanded", "false");
      }
    }

    // Add click event listener
    toggleButton.addEventListener("click", () => {
      if (parentLi) {
        // Add the user-interaction class to enable animations
        parentLi.classList.add("user-interaction");

        const wasExpanded = parentLi.classList.contains("expanded");

        if (wasExpanded) {
          // Close this accordion
          parentLi.classList.remove("expanded");
          toggleButton.setAttribute("aria-expanded", "false");
          localStorage.setItem(`accordion-${accordionId}`, "false");
        } else {
          // Close all other accordions first
          toggleButtons.forEach((otherToggleButton) => {
            const otherAccordionId = otherToggleButton.getAttribute(
              "data-accordion-toggle",
            );
            const otherParentLi = otherToggleButton.closest("li");

            if (otherToggleButton !== toggleButton && otherParentLi) {
              otherParentLi.classList.remove("expanded");
              otherToggleButton.setAttribute("aria-expanded", "false");
              localStorage.setItem(`accordion-${otherAccordionId}`, "false");
            }
          });

          // Open this accordion
          parentLi.classList.add("expanded");
          toggleButton.setAttribute("aria-expanded", "true");
          localStorage.setItem(`accordion-${accordionId}`, "true");
        }
      }
    });
  });
}

if (sidebar) {
  // Opt-in disclosure groups (item.disclosure in a section's _data.ts).
  // Each group is independent: opening one never closes another. The server
  // renders the active trail open; other groups restore the user's last
  // choice from localStorage, defaulting to collapsed. The legacy accordion
  // above is untouched and handles all non-opted-in groups.
  sidebar.querySelectorAll("[data-disclosure]").forEach((group) => {
    const list = group.querySelector(":scope > ul");
    const buttons = group.querySelectorAll("[data-disclosure-toggle]");
    if (!list) return;
    const storageKey = `sidebar-open:${list.id}`;

    const setOpen = (open, persist) => {
      group.setAttribute("data-open", String(open));
      list.hidden = !open;
      buttons.forEach((b) => b.setAttribute("aria-expanded", String(open)));
      if (persist) localStorage.setItem(storageKey, String(open));
    };

    if (
      group.getAttribute("data-open") !== "true" &&
      localStorage.getItem(storageKey) === "true"
    ) {
      setOpen(true, false);
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        setOpen(group.getAttribute("data-open") !== "true", true);
      });
    });
  });
}

// Wire up the hamburger toggle button
if (sidebar && button) {
  button.addEventListener("click", () => {
    const wasOpen = button.getAttribute("aria-pressed") === "true";
    sidebar.setAttribute("data-open", String(!wasOpen));
    button.setAttribute("aria-pressed", String(!wasOpen));
    sidebar.focus();
  });

  globalThis.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      sidebar.setAttribute("data-open", "false");
      button.setAttribute("aria-pressed", "false");
    }
  });
}

// Scroll the current left sidebar item into view and expand its accordion if needed
// Look for the active link first, then fall back to any active element
const currentSidebarItem = sidebar.querySelector("a[data-active=true]") ||
  sidebar.querySelector("[data-active=true]");
if (currentSidebarItem) {
  // Find if the active item is inside an accordion by traversing up
  let currentElement = currentSidebarItem;
  let accordionContainer = null;
  let accordionToggle = null;

  // Walk up the DOM to find an accordion container
  while (currentElement && currentElement !== sidebar) {
    currentElement = currentElement.parentElement;
    if (currentElement && currentElement.tagName === "LI") {
      const toggleButton = currentElement.querySelector(
        ".sub-nav-toggle[data-accordion-toggle]",
      );
      if (toggleButton) {
        accordionContainer = currentElement;
        accordionToggle = toggleButton;
        break;
      }
    }
  }

  // If we found an accordion containing the active item, expand it
  if (accordionContainer && accordionToggle) {
    const accordionId = accordionToggle.getAttribute("data-accordion-toggle");

    // Close all other accordions first (reuse the toggleButtons from above)
    const allToggleButtons = document.querySelectorAll(
      ".sub-nav-toggle[data-accordion-toggle]",
    );
    allToggleButtons.forEach((otherToggleButton) => {
      const otherAccordionId = otherToggleButton.getAttribute(
        "data-accordion-toggle",
      );
      const otherParentLi = otherToggleButton.closest("li");

      if (otherToggleButton !== accordionToggle && otherParentLi) {
        otherParentLi.classList.remove("expanded");
        otherToggleButton.setAttribute("aria-expanded", "false");
        localStorage.setItem(`accordion-${otherAccordionId}`, "false");
      }
    });

    // Expand the accordion containing the active item
    accordionContainer.classList.add("expanded");
    accordionToggle.setAttribute("aria-expanded", "true");
    localStorage.setItem(`accordion-${accordionId}`, "true");
  }

  // Scroll to the active item after a longer delay to allow accordion animation
  setTimeout(() => {
    // Only scroll the aside/nav sidebar elements, not the main document
    const aside = document.querySelector("aside");
    const nav = document.getElementById("nav");

    // Try aside first, then nav as fallback
    const sidebarElement = aside || nav;

    if (sidebarElement && sidebarElement.scrollTo) {
      try {
        const rect = currentSidebarItem.getBoundingClientRect();
        const sidebarRect = sidebarElement.getBoundingClientRect();

        // Calculate scroll position to center the item in the sidebar viewport
        const targetScrollTop = sidebarElement.scrollTop + rect.top -
          sidebarRect.top -
          (sidebarRect.height / 2) + (rect.height / 2);

        sidebarElement.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth",
        });
      } catch (_e) {
        // Silently handle scroll errors
      }
    }
  }, 300);
}

// Make the right sidebar follow the user's scroll position
const desktopToc = document.querySelector("#toc");

if (desktopToc) {
  const tocItems = Array.from(document.querySelectorAll("#toc a"));
  // Only track headings that actually have an entry in the TOC — otherwise a
  // heading without a TOC link would clear the active item and leave nothing
  // highlighted.
  const headings = Array.from(
    document.querySelectorAll(
      ".markdown-body :where(h1, h2, h3, h4, h5, h6)",
    ),
  ).filter(
    (h) => h.id && document.querySelector(`#toc a[href="#${h.id}"]`),
  );

  if (headings.length > 0) {
    const updateActive = () => {
      const header = document.querySelector("header");
      const line = (header ? header.getBoundingClientRect().height : 64) + 24;

      // The active section is the last heading whose top has scrolled past the
      // line just below the sticky header.
      let current = headings[0];
      for (const h of headings) {
        if (h.getBoundingClientRect().top - line <= 0) {
          current = h;
        } else {
          break;
        }
      }

      // When scrolled to the very bottom, pin to the last heading so short
      // trailing sections still register.
      const atBottom = window.innerHeight + Math.ceil(window.scrollY) >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        current = headings[headings.length - 1];
      }

      const activeHref = `#${current.id}`;
      tocItems.forEach((item) => {
        item.classList.toggle(
          "active",
          item.getAttribute("href") === activeHref,
        );
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    document.addEventListener("scroll", onScroll, { passive: true });
    globalThis.addEventListener("resize", onScroll, { passive: true });
    updateActive();
  }
}

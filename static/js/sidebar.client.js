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
          parentLi.classList.remove("expanded");
          toggleButton.setAttribute("aria-expanded", "false");
          localStorage.setItem(`accordion-${accordionId}`, "false");
        } else {
          parentLi.classList.add("expanded");
          toggleButton.setAttribute("aria-expanded", "true");
          localStorage.setItem(`accordion-${accordionId}`, "true");
        }
      }
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

// Scroll the current left sidebar item into view
const currentSidebarItem = sidebar.querySelector("[data-active=true]");
if (currentSidebarItem) {
  currentSidebarItem.scrollIntoView({ block: "nearest" });
}

// Make the right sidebar follow the user's scroll position
const desktopToc = document.querySelector("#toc");

if (desktopToc) {
  const tocItems = document.querySelectorAll("#toc a");
  const pageHeadings = document.querySelectorAll(
    ".markdown-body :where(h1, h2, h3, h4, h5, h6)",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const tocLink = document.querySelector(`#toc a[href="#${id}"]`);

        if (entry.isIntersecting) {
          tocItems.forEach((item) => item.classList.remove("active"));
          if (tocLink) {
            tocLink.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: "-0% 0px -75% 0px",
      threshold: 0.5,
    },
  );

  pageHeadings.forEach((heading) => {
    observer.observe(heading);
  });
}

const sidebar = document.getElementById("nav");
const button = document.getElementById("hamburger-button");

if (sidebar) {
  const checkboxes = document.querySelectorAll(".sub-nav-toggle-checkbox");
  checkboxes.forEach((checkbox) => {
    // on change of the checkbox, update the checked state in the local storage
    checkbox.addEventListener("change", () => {
      console.log("updated");
      localStorage.setItem(checkbox.id, checkbox.checked);
    });

    // set the checked state of the checkbox based on the value in the local storage
    const checked = localStorage.getItem(checkbox.id) === "true";
    checkbox.checked = checked;
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
const desktopToc = document.querySelector(".toc-desktop");

if (desktopToc) {
  const tocItems = document.querySelectorAll(".toc-desktop a");
  const pageHeadings = document.querySelectorAll(
    ".markdown-body :where(h1, h2, h3, h4, h5, h6)",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const tocLink = document.querySelector(`.toc-desktop a[href="#${id}"]`);

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

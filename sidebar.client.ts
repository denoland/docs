for (const el of document.querySelectorAll("[data-accordion-trigger]")) {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const parent = el.parentElement!;
    const content = parent.querySelector("[data-accordion-content]");
    const hidden = content!.classList.toggle("hidden");
    el.querySelector("svg")!.style.transform = hidden
      ? "rotate(90deg)"
      : "rotate(180deg)";
    for (const el of document.querySelectorAll("[data-accordion-content]")) {
      if (el !== content) {
        el.classList.add("hidden");
        el.parentElement!.querySelector("svg")!.style.transform =
          "rotate(90deg)";
      }
    }
  });
}

const sidebar = document.getElementById("sidebar")!;
const sidebarOpen = document.getElementById("sidebar-open");
const sidebarClose = document.getElementById("sidebar-close");
const sidebarCover = document.getElementById("sidebar-cover")!;

sidebarOpen?.addEventListener("click", () => {
  sidebar.dataset.open = "true";
  sidebarCover.dataset.open = "true";
});
sidebarClose?.addEventListener("click", () => {
  sidebar.dataset.open = "false";
  sidebarCover.dataset.open = "false";
});
sidebarCover?.addEventListener("click", () => {
  sidebar.dataset.open = "false";
  sidebarCover.dataset.open = "false";
});

const toc = document.getElementById("toc");
if (toc !== null) {
  const headings = document.querySelectorAll(
    ".markdown-body :where(h2, h3, h4, h5, h6)",
  );

  const ACTIVE_CSS = "sidebar__current-item";
  let activeId = "";
  const observer = new IntersectionObserver(
    (entries) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (entry.isIntersecting) {
          const id = entry.target.id;
          toc
            .querySelector(`a[href="#${activeId}"]`)
            ?.classList.remove(ACTIVE_CSS);
          toc.querySelector(`a[href="#${id}"]`)?.classList.add(ACTIVE_CSS);
          activeId = id;
        }
      }
    },
    { rootMargin: "0% 0% -70% 0%" },
  );

  headings.forEach((el) => observer.observe(el));
}

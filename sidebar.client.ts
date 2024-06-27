for (const el of document.querySelectorAll("[data-accordion-trigger]")) {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const parent = el.parentElement!;
    const content = parent.querySelector("[data-accordion-content]");
    const hidden = content!.classList
      .toggle("hidden");
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

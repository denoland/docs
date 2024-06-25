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

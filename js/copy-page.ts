// Primary "Copy page" button — directly copies URL
document.querySelectorAll<HTMLButtonElement>(".copy-page-main-btn").forEach(
  (btn) => {
    btn.addEventListener("click", () => {
      navigator?.clipboard?.writeText(window.location.href).then(() => {
        const label = btn.querySelector<HTMLElement>(".copy-page-main-label");
        if (label) {
          const original = label.textContent;
          label.textContent = "Copied!";
          setTimeout(() => {
            label.textContent = original;
          }, 2000);
        }
      }).catch(() => {
        const label = btn.querySelector<HTMLElement>(".copy-page-main-label");
        if (label) {
          const original = label.textContent;
          label.textContent = "Copy failed";
          setTimeout(() => {
            label.textContent = original;
          }, 2000);
        }
      });
    });
  },
);

// Popover panel — position below the chevron button + rotate chevron
const panel = document.getElementById("copy-page-menu") as HTMLElement | null;
const toggleBtn = document.querySelector<HTMLButtonElement>(
  ".copy-page-toggle-btn",
);

panel?.addEventListener("toggle", (event) => {
  const e = event as ToggleEvent;
  const chevron = toggleBtn?.querySelector<SVGElement>(".copy-page-chevron");

  if (e.newState === "open" && toggleBtn) {
    const rect = toggleBtn.getBoundingClientRect();
    panel.style.top = `${rect.bottom + 4}px`;
    panel.style.right = `${window.innerWidth - rect.right}px`;
  }
  if (chevron) {
    chevron.style.transform = e.newState === "open" ? "rotate(180deg)" : "";
  }
});

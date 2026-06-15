// Primary "Copy page" button — directly copies URL
document.querySelectorAll<HTMLButtonElement>(".copy-page-main-btn").forEach(
  (btn) => {
    btn.addEventListener("click", () => {
      navigator?.clipboard?.writeText(globalThis.location.href).then(() => {
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

const supportsAnchor = CSS.supports("anchor-name", "--a");

if (!supportsAnchor && panel) {
  panel.style.setProperty("position-anchor", "unset");
  panel.style.setProperty("position-area", "unset");
  panel.style.setProperty("position-try-fallbacks", "none");
}

panel?.addEventListener("toggle", (event) => {
  const e = event as ToggleEvent;
  const chevron = toggleBtn?.querySelector<SVGElement>(".copy-page-chevron");

  const splitBtn = toggleBtn?.closest<HTMLElement>(".copy-page-split");
  if (e.newState === "open" && splitBtn && toggleBtn) {
    // Only position via JS when CSS anchor positioning isn't supported
    if (!supportsAnchor) {
      // Use requestAnimationFrame to ensure the panel is rendered before measuring
      requestAnimationFrame(() => {
        // Use toggleBtn for vertical position (splitBtn may include popover in measurement)
        // Use splitBtn for horizontal alignment (left edge of whole button)
        const btnRect = toggleBtn.getBoundingClientRect();
        const splitRect = splitBtn.getBoundingClientRect();
        const panelWidth = panel.offsetWidth;

        const top = btnRect.bottom + 4;
        let right = globalThis.innerWidth - splitRect.right;

        // Clamp so the panel doesn't overflow the left edge
        const left = globalThis.innerWidth - right - panelWidth;
        if (left < 8) {
          right = globalThis.innerWidth - panelWidth - 8;
        }

        panel.style.top = `${top}px`;
        panel.style.right = `${right}px`;
      });
    }
  }
  if (chevron) {
    chevron.style.transform = e.newState === "open" ? "rotate(180deg)" : "";
  }
});

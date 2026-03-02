// Rotate chevron when dropdown opens/closes
document.querySelectorAll<HTMLDetailsElement>(".copy-page-dropdown").forEach(
  (dropdown) => {
    dropdown.addEventListener("toggle", () => {
      const chevron = dropdown.querySelector<SVGElement>(".copy-page-chevron");
      if (chevron) {
        chevron.style.transform = dropdown.open ? "rotate(180deg)" : "";
      }
    });
  },
);

// Handle "Copy page link" button
document.querySelectorAll<HTMLButtonElement>(".copy-page-link-btn").forEach(
  (btn) => {
    btn.addEventListener("click", () => {
      navigator?.clipboard?.writeText(window.location.href).then(() => {
        const label = btn.querySelector<HTMLElement>(".copy-page-link-label");
        if (label) {
          const original = label.textContent;
          label.textContent = "Copied!";
          setTimeout(() => {
            label.textContent = original;
          }, 2000);
        }
        const dropdown = btn.closest<HTMLDetailsElement>(".copy-page-dropdown");
        if (dropdown) dropdown.open = false;
      });
    });
  },
);

const searchbar = document.getElementById("lint-rule-search") as
  | HTMLInputElement
  | null;
const tagButtons = document.querySelectorAll<HTMLButtonElement>(
  "[data-tag-btn]",
);
const activeTags = new Set<string>();

/**
 * Shows or hides each rule box based on the current search query and active tag filters.
 */
function updateVisibility() {
  const searchQuery = searchbar?.value ?? "";
  const allBoxes = document.querySelectorAll<HTMLElement>(".lint-rule-box");

  for (const box of allBoxes) {
    const matchesSearch = !searchQuery || box.id.includes(searchQuery);
    const boxTags = (box.dataset.tags ?? "").split(",").filter(Boolean);
    const matchesFilter = activeTags.size === 0 ||
      boxTags.some((tag) => activeTags.has(tag));

    box.style.display = matchesSearch && matchesFilter ? "" : "none";
  }
}

/**
 * Toggles a tag filter button on or off and updates the rule list accordingly.
 */
function handleTagFilterButtonClick(button: HTMLButtonElement) {
  const tag = button.dataset.tagBtn!;
  const isActive = activeTags.has(tag);

  if (isActive) {
    activeTags.delete(tag);
    button.setAttribute("aria-pressed", "false");
  } else {
    activeTags.add(tag);
    button.setAttribute("aria-pressed", "true");
  }

  updateVisibility();
}

if (searchbar) {
  searchbar.addEventListener("input", updateVisibility);
}

for (const button of tagButtons) {
  button.addEventListener("click", () => handleTagFilterButtonClick(button));
}

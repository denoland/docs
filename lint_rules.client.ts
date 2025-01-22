const searchbar = document.getElementById("lint-rule-search");
console.log(searchbar);

function selectAllLintRuleBoxes() {
  return document.querySelectorAll(".lint-rule-box");
}

if (searchbar) {
  searchbar.addEventListener("input", (e) => {
    const query = e.currentTarget.value;
    console.log("search query", query);

    if (query) {
      const allBoxes = selectAllLintRuleBoxes();

      for (const box of allBoxes) {
        if (!box.id.includes(query)) {
          box.style.display = "none";
        } else {
          box.style.display = "block";
        }
      }
    }
  });
}

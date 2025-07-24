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

if (sidebar && button) {
  button.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    const wasOpen = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!wasOpen));
    sidebar.focus();
  });

  globalThis.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      sidebar.classList.remove("open");
      button.setAttribute("aria-pressed", "false");
    }
  });
}

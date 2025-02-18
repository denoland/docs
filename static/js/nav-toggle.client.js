const sidebar = document.getElementById("nav");

if (sidebar) {
  const checkboxes = document.querySelectorAll(".sub-nav-toggle-checkbox");
  checkboxes.forEach((checkbox) => {
    // on change of the checkbox, update the checked state in the local storage
    checkbox.addEventListener("change", (e) => {
      console.log("updated");
      localStorage.setItem(checkbox.id, checkbox.checked);
    });

    // set the checked state of the checkbox based on the value in the local storage
    const checked = localStorage.getItem(checkbox.id) === "true";
    checkbox.checked = checked;
  });
}

const toggleDarkMode = () => {
  const colorThemes = document.querySelectorAll("[data-color-mode]");
  if (localStorage.theme === "light") {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    colorThemes.forEach((el) => {
      el.setAttribute("data-color-mode", "dark");
    });
  } else {
    localStorage.theme = "light";
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    colorThemes.forEach((el) => {
      el.setAttribute("data-color-mode", "light");
    });
  }
};

const darkModeToggleButtons = document.querySelectorAll(
  ".dark-mode-toggle.button"
);

darkModeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleDarkMode();
  });
});

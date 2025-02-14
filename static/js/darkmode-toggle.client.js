const colorThemes = document.querySelectorAll("[data-color-mode]");
const toggleDarkMode = () => {
  const getCurrentTheme = () => {
    const userPrefersDark = globalThis.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (localStorage.denoDocsTheme) return localStorage.denoDocsTheme;
    return userPrefersDark ? "dark" : "light";
  };
  if (getCurrentTheme() === "light") {
    localStorage.denoDocsTheme = "dark";
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    colorThemes.forEach((el) => {
      el.setAttribute("data-color-mode", "dark");
    });
  } else {
    localStorage.denoDocsTheme = "light";
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    colorThemes.forEach((el) => {
      el.setAttribute("data-color-mode", "light");
    });
  }
};

const darkModeToggleButtons = document.getElementById("theme-toggle");

darkModeToggleButtons.addEventListener("click", () => {
  toggleDarkMode();
});

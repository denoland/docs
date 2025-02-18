// Constants
const THEME = {
  DARK: "dark",
  LIGHT: "light",
  STORAGE_KEY: "denoDocsTheme",
};

// DOM Elements
const colorThemes = document.querySelectorAll("[data-color-mode]");
const darkModeToggleButton = document.getElementById("theme-toggle");

// Get user's preferred theme
const getUserPreference = () => {
  const storedTheme = localStorage.getItem(THEME.STORAGE_KEY);
  if (storedTheme) return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME.DARK
    : THEME.LIGHT;
};

// Update theme in DOM and localStorage
const setTheme = (theme) => {
  document.documentElement.classList.remove(THEME.DARK, THEME.LIGHT);
  document.documentElement.classList.add(theme);

  colorThemes.forEach((el) => {
    el.setAttribute("data-color-mode", theme);
  });

  localStorage.setItem(THEME.STORAGE_KEY, theme);
};

// Toggle between light and dark themes
const toggleDarkMode = () => {
  const currentTheme = getUserPreference();
  const newTheme = currentTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
  setTheme(newTheme);
};

// Initialize
const init = () => {
  if (!darkModeToggleButton) {
    console.warn("Theme toggle button not found");
    return;
  }

  // Set initial theme
  setTheme(getUserPreference());

  // Add click listener
  darkModeToggleButton.addEventListener("click", toggleDarkMode);

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME.STORAGE_KEY)) {
        setTheme(e.matches ? THEME.DARK : THEME.LIGHT);
      }
    });
};

init();

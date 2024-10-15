if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
} else {
  document.documentElement.classList.add("light");
  document.documentElement.classList.remove("dark");
}

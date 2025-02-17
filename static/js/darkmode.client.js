const THEME_KEY = 'denoDocsTheme';
const DARK_CLASS = 'dark';
const LIGHT_CLASS = 'light';

function getPreferredTheme() {
  if (THEME_KEY in localStorage) {
    return localStorage[THEME_KEY];
  }
  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_CLASS : LIGHT_CLASS;
}

function setTheme(theme) {
  const root = document.documentElement;
  root.classList.add(theme);
  root.classList.remove(theme === DARK_CLASS ? LIGHT_CLASS : DARK_CLASS);
}

setTheme(getPreferredTheme());

export const css = "@import './_components/ThemeToggle.css';";

export default function () {
  return (
    <button
      type="button"
      aria-label="toggle theme"
      className="theme-toggle"
      id="theme-toggle"
    >
      Toggle Theme
    </button>
  );
}

export const js = `
import "/js/darkmode.client.js";
import "/js/darkmode-toggle.client.js";
`;

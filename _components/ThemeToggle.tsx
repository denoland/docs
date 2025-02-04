export const css = `
.theme-toggle {
  height: 2.3rem;
  width: 2.3rem;
  font-size: 0;
  color: transparent;
  background: transparent no-repeat center;
  background-size: 1.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  transition: all 200ms ease-in-out;
  color: var(--foreground-secondary);
  &:hover {
    text-decoration: none;
    background-color: var(--background-secondary);
    border-color: var(--background-tertiary);
  }
}

.light .theme-toggle {
  background-image: url(/images/dark.svg);
  }
  
  .dark .theme-toggle {
  background-image: url(/images/light.svg);
}
`;

export const js = `
import "/js/darkmode.client.js";
import "/js/darkmode-toggle.client.js";
`;

export default (data: Lume.Data, helpers: Lume.Helpers) => (
  <button
    type="button"
    aria-label="toggle theme"
    className="theme-toggle"
    id="theme-toggle"
  >
    Toggle Theme
  </button>
);

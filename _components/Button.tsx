export default function ({ children }) {
  return (
    <button className="my-button">
      {children}
    </button>
  );
}

export const css = `@import "./_components/Button.css";`;

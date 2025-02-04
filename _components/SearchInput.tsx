export const css = `
.search-input {
  width: 100%;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  padding: 0.375rem 0.75rem 0.375rem 0.5rem;
  padding-left: 2em;
  border: 1px solid;
  color: #475569;
  background-color: #f1f5f9;
  transition: all 150ms ease-in-out;
  background: url(/img/search.svg) no-repeat 0.5em 50%;
  background-size: 1em;
}

.search-input:hover {
  background-color: #e2e8f0;
}

.dark {
  .search-input {
    background-color: var(--background-secondary);
    color: #e2e8f0;
    border-color: var(--foreground-tertiary);
  }

  .search-input:hover {
    background-color: #334155;
  }
}
`;

export default function SearchInput() {
  return (
    <>
      <form
        action="https://www.google.com/search"
        method="get"
        className="search"
        target="_blank"
      >
        <input
          type="search"
          name="q"
          id="search-str"
          placeholder="Search"
          className="search-input"
        />
        <input type="hidden" name="q" id="q" value="site:deno.com" />
      </form>
    </>
  );
}

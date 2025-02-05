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

export const css = `@import "./_components/SearchInput.css";`;

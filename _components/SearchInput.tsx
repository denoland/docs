export default function SearchInput() {
  return (
    <>
      <form
        action="https://www.google.com/search"
        method="get"
        className="mb-0"
        target="_blank"
      >
        <input
          type="search"
          name="q"
          id="search-str"
          placeholder="Search"
          className="w-full min-w-24 rounded-lg text-sm leading-normal pt-1 pr-3 pb-1 pl-8 border transition-all duration-150
          text-foreground-primary border-foreground-tertiary hover:bg-background-secondary focus:bg-background-secondary"
          style="background: url(/img/search.svg) no-repeat 0.5em 50%; background-size: 1em; background-color: var(--color-foreground-quaternary);"
        />
        <input type="hidden" name="q" id="q" value="site:deno.com" />
      </form>
    </>
  );
}

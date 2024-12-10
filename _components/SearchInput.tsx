export default function SearchInput() {
  return (
    <form
      action="https://www.google.com/search"
      method="get"
      class="search m-0"
    >
      <input type="hidden" name="q" id="q" value="site:https://deno.com" />
      <input
        type="search"
        name="q"
        id="search-str"
        placeholder="Search"
        className="
          w-full
          lg:flex
          rounded-lg
          items-center
          text-sm
          leading-6
          py-1.5 pl-2 pr-3
          border
          text-slate-600
          bg-slate-100
          dark:bg-background-secondary
          dark:text-slate-200
          dark:highlight-white/5
          dark:hover:bg-slate-700
          dark:border-foreground-tertiary
          hover:bg-slate-200
          duration-150 ease-in-out"
      />
    </form>
  );
}

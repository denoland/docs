export default function SearchInput() {
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="search"
          placeholder="Search docs..."
          id="orama-search-input"
          className="w-full min-w-24 rounded-lg text-sm leading-normal pt-1 pr-3 pb-1 pl-8 border transition-all duration-150
          text-foreground-primary border-foreground-tertiary hover:bg-background-secondary focus:bg-background-secondary"
          style="background: url(/img/search.svg) no-repeat 0.5em 50%; background-size: 1em; background-color: hsl(var(--foreground-quaternary));"
          autocomplete="off"
        />
        <div
          id="orama-search-loading"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 hidden"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground-primary">
          </div>
        </div>
      </div>

      <div
        id="orama-search-results"
        className="absolute top-full left-0 right-0 mt-1 bg-background-raw border border-foreground-tertiary rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto hidden"
      >
        {/* Results will be populated via JavaScript */}
      </div>
    </div>
  );
}

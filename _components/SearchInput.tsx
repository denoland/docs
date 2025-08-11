export default function SearchInput() {
  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="search"
          placeholder="Search"
          id="orama-search-input"
          className="w-full min-w-24 rounded-lg text-sm leading-normal p-1 pl-8 border transition-all duration-150
          text-foreground-primary border-foreground-secondary hover:bg-background-secondary focus:bg-background-secondary focus:outline-offset-1"
          style="background: url(/img/search.svg) no-repeat 0.5em 50%; background-size: 1.25em; background-color: var(--color-background-raw);"
        />
        <kbd
          id="search-key"
          className="hidden xs:flex pointer-events-none absolute font-sans rounded-sm top-1 right-1 bottom-1 w-auto border-1 border-foreground-tertiary border-b-2 border-r-2 bg-background-primary text-foreground-secondary text-center text-xs font-bold p-2 items-center justify-center dark:bg-background-secondary dark:border-gray-700"
        >
          ⌘K
        </kbd>
        <div
          id="orama-search-loading"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 hidden bg-background-raw"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-transparent border-r-foreground-primary bg-background-raw" />
        </div>
      </div>

      {/* Enhanced Popover for Search Results */}
      <div
        id="orama-search-results"
        className="absolute top-full left-0 right-0 mt-2 bg-background-raw border border-foreground-tertiary rounded-xl shadow-2xl z-50 max-h-[32rem] overflow-hidden hidden
        min-w-[480px] max-w-2xl lg:left-auto lg:right-0"
      >
        <div
          id="orama-search-results-content"
          className="overflow-y-auto max-h-[28rem]"
        >
          {/* Results will be populated via JavaScript */}
        </div>

        {/* Footer with search tips */}
        <div className="border-t border-foreground-tertiary bg-background-secondary px-4 py-2">
          <div className="flex items-center justify-between text-xs text-foreground-secondary">
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">↑↓</span>
                <span className="sr-only">Up or down</span>
              </kbd>
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">↵</span>
                <span className="sr-only">Enter</span>
              </kbd>
              to select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">ESC</span>
                <span className="sr-only">Escape</span>
              </kbd>
              to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

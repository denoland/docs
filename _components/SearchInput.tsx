export default function SearchInput() {
  return (
    <div className="md:relative w-full">
      {/* ☝️ That md:relative class is crucial for making the search bar pop up in the right place. Don't change it, or add any other positioning classes, unless you're ready to account for positioning across all breakpoints. */}
      <div className="relative">
        <input
          type="search"
          placeholder="Search"
          id="orama-search-input"
          className="w-full min-w-24 rounded-lg placeholder:text-sm text-base leading-normal p-1 pl-8 border transition-all duration-150
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
        <div
          className="sr-only"
          aria-live="polite"
          id="orama-results-announcer"
        >
          {/* Text updated by JavaScript. */}
        </div>
      </div>

      {/* Enhanced Popover for Search Results */}
      <div
        id="orama-search-results"
        className="absolute inset-2 left-2 right-2 h-[calc(100vh-8rem)] top-10 md:top-full md:left-auto md:right-0 mt-2 bg-background-raw border border-foreground-tertiary rounded-xl shadow-2xl z-50 md:max-h-128 overflow-hidden hidden md:min-w-160 max-w-2xl"
      >
        <div
          id="orama-search-results-content"
          className="overflow-y-auto h-full"
        >
          {/* Results will be populated via JavaScript */}
        </div>

        {/* Footer with search tips */}
        <div className="border-t border-foreground-tertiary bg-background-secondary px-4 py-2 sticky bottom-0">
          <div className="flex items-center gap-6 text-xs text-foreground-secondary">
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">↑↓</span>
                <span className="sr-only">Up or down to</span>
              </kbd>
              navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">↵</span>
                <span className="sr-only">Enter to</span>
              </kbd>
              select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">ESC</span>
                <span className="sr-only">Escape to</span>
              </kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

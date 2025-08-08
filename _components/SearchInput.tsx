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
          style="background: url(/img/search.svg) no-repeat 0.5em 50%; background-size: 1em; background-color: var(--color-foreground-quaternary);"
        />
        <div
          id="orama-search-loading"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 hidden"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground-primary">
          </div>
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
          <div className="flex items-center justify-between text-xs text-foreground-tertiary">
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-tertiary border border-foreground-tertiary rounded mr-1">
                ↑↓
              </kbd>
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-tertiary border border-foreground-tertiary rounded mr-1">
                ↵
              </kbd>
              to select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-tertiary border border-foreground-tertiary rounded">
                ESC
              </kbd>
              to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

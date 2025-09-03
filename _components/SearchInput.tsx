export default function SearchInput() {
  return (
    <>
      {/* Search Input Trigger */}
      <div className="md:relative w-full">
        <div className="relative">
          <input
            type="search"
            placeholder="Search documentation..."
            id="orama-search-input"
            className="w-full min-w-24 rounded-lg placeholder:text-sm text-base leading-normal p-1 pl-8 pr-16 border transition-colors duration-200
            text-foreground-primary border-foreground-secondary hover:bg-background-secondary focus:bg-background-secondary focus:outline-offset-1
            cursor-pointer"
            style="background: url(/img/search.svg) no-repeat 0.5em 50%; background-size: 1.25em; background-color: var(--color-background-raw);"
            readOnly
          />
          <kbd
            id="search-key"
            className="hidden xs:flex pointer-events-none absolute font-sans rounded-sm top-1 right-1 bottom-1 w-auto border-1 border-foreground-tertiary border-b-2 border-r-2 bg-background-primary text-foreground-secondary text-center text-xs font-bold p-2 items-center justify-center dark:bg-background-secondary dark:border-gray-700"
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Search Modal */}
      <dialog
        id="orama-search-modal"
        className="w-full h-full bg-black/50 backdrop-blur-sm fixed inset-0 max-w-none max-h-none z-50 overflow-y-auto p-4 sm:p-6 md:p-20"
        role="dialog"
      >
        <div className="mx-auto max-w-2xl w-full transform overflow-hidden rounded-xl bg-background-raw shadow-2xl border border-foreground-primary transition-all">
          {/* Search Header */}
          <div className="relative flex items-center justify-between px-2">
            <input
              type="search"
              id="orama-search-input-modal"
              className="h-12 w-full border-0 bg-transparent text-foreground-primary placeholder:text-foreground-secondary focus:ring-0 text-base focus-visible:outline-none"
              placeholder="Search documentation..."
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellcheck={false}
              style="background: url(/img/search.svg) no-repeat 0.5em 50%; background-size: 1.25em; background-color: var(--color-background-raw);"
            />

            {/* Mode Toggle */}
            <div className="inset-y-0 right-0 flex items-center shrink-0">
              <button
                type="button"
                id="search-mode-toggle"
                className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-foreground-secondary hover:text-foreground-primary transition-colors cursor-pointer"
                title="Toggle AI search mode (Ctrl+Shift+K)"
                aria-pressed="false"
              >
                <div
                  id="search-mode-toggle__indicator"
                  className="flex items-center w-6 h-4 rounded-full bg-foreground-tertiary p-0.5 relative dark:bg-gray-600 before:aspect-square before:h-3 before:bg-background-raw before:rounded-full before:transition-transform before:duration-200"
                />
                <span>Ask AI</span>
              </button>
            </div>

            {/* Loading Indicator */}
            <div
              id="orama-search-loading"
              className="absolute left-4 px-px top-1/2 transform -translate-y-1/2 hidden bg-background-raw"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-transparent border-r-foreground-primary" />
            </div>
          </div>

          {/* Search Results */}
          <div
            id="orama-search-results"
            className="max-h-80 scroll-py-2 overflow-y-auto text-sm"
          >
            <div
              id="orama-search-results-content"
              style="scrollbar-gutter: stable;"
            >
              {/* Results will be populated via JavaScript */}
            </div>
          </div>

          {/* Footer with keyboard shortcuts */}
          <footer className="flex flex-wrap gap-6 items-center bg-background-secondary px-4 py-3 text-xs text-foreground-secondary">
            <span>
              <kbd class="font-sans px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">↑↓</span>
                <span class="sr-only">Up or down to</span>
              </kbd>navigate
            </span>
            <span>
              <kbd class="font-sans px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">↵</span>
                <span class="sr-only">Enter to</span>
              </kbd>select
            </span>
            <span>
              <kbd class="font-sans px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">ESC</span>
                <span class="sr-only">Escape to</span>
              </kbd>close
            </span>
            <span className="flex items-center ml-auto">
              <kbd class="font-sans px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                ⌘⇧K
              </kbd>
              <span className="hidden sm:inline">Toggle AI</span>
              <span className="sm:hidden">AI</span>
            </span>
          </footer>
        </div>

        {/* Screen reader announcements */}
        <div
          className="sr-only"
          aria-live="polite"
          id="orama-results-announcer"
        >
          {/* Text updated by JavaScript */}
        </div>
      </dialog>
    </>
  );
}

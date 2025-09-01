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
            className="w-full min-w-24 rounded-lg placeholder:text-sm text-base leading-normal p-1 pl-8 pr-16 border transition-all duration-150
            text-foreground-primary border-foreground-secondary hover:bg-background-secondary focus:bg-background-secondary focus:outline-offset-1
            ai-mode:border-primary ai-mode:bg-primary/5 cursor-pointer"
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

      {/* Modal Backdrop */}
      <div
        id="search-backdrop"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden"
        aria-hidden="true"
      />

      {/* Search Modal */}
      <div
        id="orama-search-modal"
        className="fixed inset-0 z-50 hidden overflow-y-auto p-4 sm:p-6 md:p-20"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
      >
        <div className="mx-auto max-w-2xl transform divide-y divide-gray-200 overflow-hidden rounded-xl bg-background-raw shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
          {/* Search Header */}
          <div className="relative">
            <input
              type="search"
              id="orama-search-input-modal"
              className="h-12 w-full border-0 bg-transparent pl-10 pr-20 text-foreground-primary placeholder:text-foreground-secondary focus:ring-0 text-base"
              placeholder="Search documentation..."
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellcheck={false}
              style="background: url(/img/search.svg) no-repeat 0.5em 50%; background-size: 1.25em; background-color: var(--color-background-raw);"
            />

            {/* Mode Toggle */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                id="search-mode-toggle"
                className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-foreground-secondary hover:text-foreground-primary transition-colors"
                title="Toggle AI search mode (Ctrl+Shift+K)"
              >
                <span id="search-mode-text">Toggle search mode</span>
              </button>
            </div>

            {/* Loading Indicator */}
            <div
              id="orama-search-loading"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 hidden"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-transparent border-r-foreground-primary" />
            </div>
          </div>

          {/* Search Results */}
          <div
            id="orama-search-results"
            className="max-h-80 scroll-py-2 overflow-y-auto py-2 text-sm"
          >
            <div
              id="orama-search-results-content"
              className="space-y-1"
            >
              {/* Results will be populated via JavaScript */}
            </div>
          </div>

          {/* Footer with keyboard shortcuts */}
          <div className="flex flex-wrap gap-6 items-center bg-background-secondary px-4 py-3 text-xs text-foreground-secondary">
            <span>
              <kbd class="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">↑↓</span>
                <span class="sr-only">Up or down to</span>
              </kbd>navigate
            </span>
            <span>
              <kbd class="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">↵</span>
                <span class="sr-only">Enter to</span>
              </kbd>select
            </span>
            <span>
              <kbd class="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                <span aria-hidden="true">ESC</span>
                <span class="sr-only">Escape to</span>
              </kbd>close
            </span>
            <span className="flex items-center ml-auto">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground-secondary bg-background-primary border-r-2 border-b-2 border border-foreground-tertiary rounded mr-1">
                ⌘⇧K
              </kbd>
              <span className="hidden sm:inline">Toggle AI</span>
              <span className="sm:hidden">AI</span>
            </span>
          </div>
        </div>

        {/* Screen reader announcements */}
        <div
          className="sr-only"
          aria-live="polite"
          id="orama-results-announcer"
        >
          {/* Text updated by JavaScript */}
        </div>
      </div>

      <style jsx>
        {`
        .ai-mode #orama-search-input-modal {
          border-left: 3px solid var(--color-primary);
        }
        
        .ai-mode #search-mode-icon::before {
          content: "💡";
        }
        
        .ai-mode #search-mode-text::before {
          content: "AI ";
        }

        /* Smooth transitions */
        #orama-search-modal {
          transition: opacity 150ms ease-out, transform 150ms ease-out;
        }
        
        #orama-search-modal.show {
          opacity: 1;
          transform: scale(1);
        }
        
        #orama-search-modal.hide {
          opacity: 0;
          transform: scale(0.95);
        }
      `}
      </style>
    </>
  );
}

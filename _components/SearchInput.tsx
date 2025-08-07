export default function SearchInput() {
  return (
    <>
      <div className="relative">
        <input
          type="search"
          id="pagefind-search"
          placeholder="Search"
          className="w-full min-w-24 rounded-lg text-sm leading-normal pt-1 pr-3 pb-1 pl-8 border transition-all duration-150
          text-foreground-primary border-foreground-tertiary hover:bg-background-secondary focus:bg-background-secondary"
          style="background: url(/img/search.svg) no-repeat 0.5em 50%; background-size: 1em; background-color: var(--color-foreground-quaternary);"
        />
        <div
          id="pagefind-results"
          className="absolute top-full right-0 z-50 w-96 bg-background-primary border border-foreground-tertiary rounded-md shadow-lg max-h-96 overflow-y-auto hidden"
        >
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', async () => {
              const searchInput = document.getElementById('pagefind-search');
              const resultsContainer = document.getElementById('pagefind-results');
              
              if (!searchInput || !resultsContainer) return;
              
              let pagefind;
              try {
                pagefind = await import('/pagefind/pagefind.js');
              } catch (e) {
                console.warn('Pagefind not found, search functionality disabled');
                return;
              }
              
              let currentSearch = null;
              
              const debounce = (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                  const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                  };
                  clearTimeout(timeout);
                  timeout = setTimeout(later, wait);
                };
              };
              
              const performSearch = async (query) => {
                if (!query.trim()) {
                  resultsContainer.innerHTML = '';
                  resultsContainer.classList.add('hidden');
                  return;
                }
                
                try {
                  currentSearch = query;
                  const search = await pagefind.search(query);
                  
                  // Check if this is still the current search
                  if (currentSearch !== query) return;
                  
                  if (search.results.length === 0) {
                    resultsContainer.innerHTML = '<div class="p-4 text-foreground-secondary">No results found</div>';
                    resultsContainer.classList.remove('hidden');
                    return;
                  }
                  
                  // Load first 5 results
                  const results = await Promise.all(
                    search.results.slice(0, 5).map(r => r.data())
                  );
                  
                  // Check again if this is still the current search
                  if (currentSearch !== query) return;
                  
                  resultsContainer.innerHTML = results.map(result => \`
                    <a href="\${result.url}" class="block p-3 hover:bg-background-secondary border-b border-foreground-quaternary last:border-b-0">
                      <div class="font-medium text-foreground-primary text-sm">\${result.meta.title || 'Untitled'}</div>
                      <div class="text-xs text-foreground-secondary mt-1 line-clamp-2">\${result.excerpt}</div>
                    </a>
                  \`).join('');
                  
                  resultsContainer.classList.remove('hidden');
                } catch (error) {
                  console.error('Search error:', error);
                }
              };
              
              const debouncedSearch = debounce(performSearch, 300);
              
              searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
              });
              
              searchInput.addEventListener('focus', async () => {
                try {
                  await pagefind.init();
                } catch (e) {
                  // Silently fail if pagefind isn't available
                }
              });
              
              // Hide results when clicking outside
              document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
                  resultsContainer.classList.add('hidden');
                }
              });
              
              // Show results when clicking on search input if there's content
              searchInput.addEventListener('click', () => {
                if (resultsContainer.innerHTML && searchInput.value.trim()) {
                  resultsContainer.classList.remove('hidden');
                }
              });
            });
          `,
        }}
      />
    </>
  );
}

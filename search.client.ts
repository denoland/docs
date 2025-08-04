// Orama Search Client
// This handles the client-side search functionality for the Deno docs

interface SearchResult {
  id: string;
  document: {
    title: string;
    content: string;
    url: string;
  };
}

interface SearchResults {
  hits: SearchResult[];
  count: number;
}

interface OramaClient {
  search: (params: {
    term: string;
    mode?: "vector" | "fulltext" | "hybrid";
    limit?: number;
  }) => Promise<SearchResults>;
}

// Configuration - Replace these with your actual Orama Cloud credentials
const ORAMA_CONFIG = {
  endpoint: "YOUR_ORAMA_ENDPOINT",
  apiKey: "YOUR_ORAMA_API_KEY",
};

class OramaSearch {
  private client: OramaClient | null = null;
  private searchInput: HTMLInputElement | null = null;
  private searchResults: HTMLElement | null = null;
  private searchLoading: HTMLElement | null = null;
  private searchTimeout: number | null = null;
  private isResultsOpen = false;

  constructor() {
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupElements());
    } else {
      this.setupElements();
    }

    // Initialize Orama client
    await this.initOramaClient();
  }

  setupElements() {
    this.searchInput = document.getElementById(
      "orama-search-input",
    ) as HTMLInputElement;
    this.searchResults = document.getElementById("orama-search-results");
    this.searchLoading = document.getElementById("orama-search-loading");

    if (!this.searchInput) {
      console.warn("Orama search input not found");
      return;
    }

    // Bind event listeners
    this.searchInput.addEventListener("input", this.handleInput.bind(this));
    this.searchInput.addEventListener("focus", this.handleFocus.bind(this));
    this.searchInput.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Close search results when clicking outside
    document.addEventListener("mousedown", this.handleClickOutside.bind(this));
  }

  async initOramaClient() {
    try {
      if (
        ORAMA_CONFIG.endpoint === "YOUR_ORAMA_ENDPOINT" ||
        ORAMA_CONFIG.apiKey === "YOUR_ORAMA_API_KEY"
      ) {
        console.warn(
          "Orama search not configured. Please add your endpoint and API key to search.client.ts",
        );
        this.showNotConfiguredMessage();
        return;
      }

      const { OramaClient } = await import("npm:@oramacloud/client");
      this.client = new OramaClient({
        endpoint: ORAMA_CONFIG.endpoint,
        api_key: ORAMA_CONFIG.apiKey,
      }) as unknown as OramaClient;

      console.log("Orama search client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Orama client:", error);
      this.showErrorMessage("Failed to initialize search");
    }
  }

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!value.trim()) {
      this.hideResults();
      return;
    }

    // Debounce search by 300ms
    this.searchTimeout = setTimeout(() => {
      this.performSearch(value);
    }, 300);
  }

  handleFocus() {
    if (this.searchInput?.value.trim() && this.searchResults?.children.length) {
      this.showResults();
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.hideResults();
      this.searchInput?.blur();
    }
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;
    if (!this.searchInput?.parentElement?.contains(target)) {
      this.hideResults();
    }
  }

  async performSearch(term: string) {
    if (!this.client) {
      this.showNotConfiguredMessage();
      return;
    }

    this.showLoading(true);

    try {
      const results: SearchResults = await this.client.search({
        term: term,
        mode: "fulltext",
        limit: 8,
      });

      this.renderResults(results, term);
      this.showResults();
    } catch (error) {
      console.error("Search error:", error);
      this.showErrorMessage("Search failed. Please try again.");
    } finally {
      this.showLoading(false);
    }
  }

  renderResults(results: SearchResults, searchTerm: string) {
    if (!this.searchResults) return;

    if (results.hits.length === 0) {
      this.searchResults.innerHTML = `
        <div class="p-4 text-center text-foreground-secondary">
          <p class="text-sm">No results found for "${
        this.escapeHtml(searchTerm)
      }"</p>
          <p class="text-xs mt-1">Try different keywords</p>
        </div>
      `;
      return;
    }

    const resultsHtml = `
      <div class="p-2 text-xs text-foreground-secondary border-b border-foreground-tertiary">
        ${results.count} result${results.count !== 1 ? "s" : ""}
      </div>
      ${
      results.hits.map((hit) => `
        <a
          href="${this.escapeHtml(hit.document.url)}"
          class="block p-3 hover:bg-background-secondary transition-colors duration-150 border-b border-foreground-tertiary last:border-b-0"
          onclick="globalThis.oramaSearch.hideResults()"
        >
          <div class="font-medium text-foreground-primary text-sm mb-1">
            ${
        this.highlightMatch(this.escapeHtml(hit.document.title), searchTerm)
      }
          </div>
          <div class="text-xs text-foreground-secondary line-clamp-2">
            ${
        this.highlightMatch(
          this.escapeHtml(hit.document.content.slice(0, 150)) + "...",
          searchTerm,
        )
      }
          </div>
          <div class="text-xs text-foreground-tertiary mt-1">
            ${this.escapeHtml(hit.document.url)}
          </div>
        </a>
      `).join("")
    }
    `;

    this.searchResults.innerHTML = resultsHtml;
  }

  showNotConfiguredMessage() {
    if (!this.searchResults) return;

    this.searchResults.innerHTML = `
      <div class="p-4 text-center text-foreground-secondary">
        <p class="text-sm">Search not configured</p>
        <p class="text-xs mt-1">Please add your Orama credentials</p>
      </div>
    `;
    this.showResults();
  }

  showErrorMessage(message: string) {
    if (!this.searchResults) return;

    this.searchResults.innerHTML = `
      <div class="p-4 text-center text-foreground-secondary">
        <p class="text-sm">${this.escapeHtml(message)}</p>
      </div>
    `;
    this.showResults();
  }

  showResults() {
    if (this.searchResults) {
      this.searchResults.classList.remove("hidden");
      this.isResultsOpen = true;
    }
  }

  hideResults() {
    if (this.searchResults) {
      this.searchResults.classList.add("hidden");
      this.isResultsOpen = false;
    }
  }

  showLoading(show: boolean) {
    if (this.searchLoading) {
      if (show) {
        this.searchLoading.classList.remove("hidden");
      } else {
        this.searchLoading.classList.add("hidden");
      }
    }
  }

  highlightMatch(text: string, term: string): string {
    if (!term.trim()) return text;

    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>',
    );
  }

  escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize search when the script loads
const oramaSearch = new OramaSearch();

// Make it globally available for onclick handlers
declare global {
  var oramaSearch: OramaSearch;
}

globalThis.oramaSearch = oramaSearch;

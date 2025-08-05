// Orama Search Client
// This handles the client-side search functionality for the Deno docs

interface SearchResult {
  id: string;
  document: {
    title: string;
    content: string;
    url?: string;
    path?: string;
    category?: string;
    section?: string;
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
  endpoint: "https://cloud.orama.run/v1/indexes/docs-deno-com-rczrg7",
  apiKey: "nbsTsZmL9BZvMQQ8KExOPWQoBnQbW4Dd",
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
        ORAMA_CONFIG.endpoint === "YOUR_ORAMA_ENDPOINT_HERE" ||
        ORAMA_CONFIG.apiKey === "YOUR_ORAMA_API_KEY_HERE"
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

    // Don't hide results if clicking on a search result link
    if (target.closest(".search-result-link")) {
      return;
    }

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

    // Debug: Log the URLs and paths to see what we're getting
    console.log(
      "Search results URLs:",
      results.hits.map((hit) => hit.document.url),
    );
    console.log(
      "Search results paths:",
      results.hits.map((hit) => hit.document.path),
    );
    console.log("Full search results:", results.hits);

    // Additional debugging to see what fields are available
    if (results.hits.length > 0) {
      console.log("First result structure:", results.hits[0]);
      console.log(
        "Document keys:",
        Object.keys(results.hits[0].document || {}),
      );
      console.log("Hit keys:", Object.keys(results.hits[0]));
    }

    // Filter out results that don't have valid URLs or paths
    const validResults = results.hits.filter((hit) => {
      if (hit.document && (hit.document.url || hit.document.path)) {
        return true;
      }
      // Check if we can construct a URL from other fields
      if (hit.document && (hit.document.title || hit.id)) {
        return true;
      }
      return false;
    });

    const resultsHtml = `
      <div class="p-2 text-xs text-foreground-secondary border-b border-foreground-tertiary">
        ${validResults.length} result${validResults.length !== 1 ? "s" : ""}
      </div>
      ${
      validResults.map((hit) => `
        <a
          href="${this.escapeHtml(this.formatUrl(hit.document.url, hit))}"
          class="block p-3 hover:bg-background-secondary transition-colors duration-150 border-b border-foreground-tertiary last:border-b-0 search-result-link"
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
            ${this.escapeHtml(this.formatUrl(hit.document.url, hit))}
          </div>
        </a>
      `).join("")
    }
    `;

    this.searchResults.innerHTML = resultsHtml;

    // Add simple click handler to hide results on navigation
    const searchLinks = this.searchResults.querySelectorAll(
      ".search-result-link",
    );
    searchLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Small delay to allow navigation to start
        setTimeout(() => this.hideResults(), 150);
      });
    });
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

  // Helper method to ensure URLs are properly formatted
  formatUrl(url: string | undefined, hit?: SearchResult): string {
    // First try to use the path field if available
    if (hit && hit.document && hit.document.path) {
      console.log("Using path field:", hit.document.path);
      return this.formatUrl(hit.document.path);
    }

    // Handle undefined or null URLs
    if (!url) {
      // Try to construct URL from other fields
      if (hit && hit.document) {
        // Check if there's an ID that might be a path
        if (hit.id && typeof hit.id === "string") {
          console.log("Trying to use ID as URL:", hit.id);
          return this.formatUrl(hit.id);
        }

        // Try to construct from title (this is a fallback)
        if (hit.document.title) {
          console.log(
            "No URL found, using title as fallback:",
            hit.document.title,
          );
          // Convert title to a potential path
          const pathFromTitle = hit.document.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return `/${pathFromTitle}`;
        }
      }
      return "#";
    }

    // If it's already a full URL, return as-is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it starts with '/', it's a root-relative path
    if (url.startsWith("/")) {
      return url;
    }

    // Otherwise, make it root-relative
    return "/" + url;
  }
}

// Initialize search when the script loads
const oramaSearch = new OramaSearch();

// Make it globally available for onclick handlers
declare global {
  var oramaSearch: OramaSearch;
}

globalThis.oramaSearch = oramaSearch;

// Orama Search Client
// This handles the client-side search functionality for the Deno docs

import type { OramaCloud } from "jsr:@orama/core@1.2.4";

interface SearchResult {
  id: string;
  score?: number; // Orama relevance score
  document: {
    title: string;
    content: string;
    url?: string;
    path?: string;
    category?: string;
    section?: string;
    kind?: string;
    command?: string;
  };
}

interface SearchResults {
  hits: SearchResult[];
  count: number;
}

// Configuration - Replace these with your actual Orama Cloud credentials
const ORAMA_CONFIG = {
  projectId: "c9394670-656a-4f78-a551-c2603ee119e7",
  apiKey: "c1_E4q2kmwSiWpPYzeIzP38VyHmekjnZUJL3yB7Kprr8$YF-u_cXBSn3u0-AvX",
};

class OramaSearch {
  private client: OramaCloud | null = null;
  private searchInput: HTMLInputElement | null = null;
  private searchResults: HTMLElement | null = null;
  private searchLoading: HTMLElement | null = null;
  private ariaLiveRegion: HTMLElement | null = null;
  private searchTimeout: number | null = null;
  private isResultsOpen = false;
  private selectedIndex = -1; // Track selected result for keyboard navigation

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
    this.searchResults = document.getElementById(
      "orama-search-results-content",
    ); // Target the scrollable container
    this.searchLoading = document.getElementById("orama-search-loading");
    this.ariaLiveRegion = document.getElementById("orama-results-announcer");

    if (!this.searchInput) {
      console.warn("Orama search input not found");
      return;
    }

    // Bind event listeners
    this.searchInput.addEventListener("input", this.handleInput.bind(this));
    this.searchInput.addEventListener("focus", this.handleFocus.bind(this));
    this.searchInput.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.searchResults?.addEventListener("keyup", (event) => {
      if (event.key === "Escape") this.handleEscape();
    });
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        this.searchInput?.focus();
      }
    });

    const searchKey = document.getElementById("search-key");
    let isMac = false;
    const uaPlatform =
      (navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData?.platform;
    if (
      (uaPlatform && uaPlatform.toUpperCase().startsWith("MAC")) ||
      navigator.userAgent.indexOf("Mac OS X") != -1 ||
      navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)
    ) {
      isMac = true;
    }

    if (searchKey) {
      if (isMac) {
        searchKey.textContent = "⌘K";
      } else {
        searchKey.textContent = "Ctrl+K";
      }
    }

    // Close search results when clicking outside
    document.addEventListener("mousedown", this.handleClickOutside.bind(this));
  }

  async initOramaClient() {
    try {
      if (
        ORAMA_CONFIG.projectId === "YOUR_ORAMA_PROJECT_ID_HERE" ||
        ORAMA_CONFIG.apiKey === "YOUR_ORAMA_API_KEY_HERE"
      ) {
        console.warn(
          "Orama search not configured. Please add your project ID and API key to search.client.ts",
        );
        this.showNotConfiguredMessage();
        return;
      }

      const { OramaCloud } = await import("jsr:@orama/core@1.2.4");
      this.client = new OramaCloud({
        projectId: ORAMA_CONFIG.projectId,
        apiKey: ORAMA_CONFIG.apiKey,
      });

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

    // Reset selection when user types
    this.selectedIndex = -1;

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

  handleEscape() {
    this.hideResults();
    if (this.searchInput) {
      this.searchInput.value = ""; // Clears input when escape is triggered from within the list rather than on the input
      this.searchInput.focus();
    }
    this.selectedIndex = -1;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.isResultsOpen) {
      return;
    }

    const resultsLinks = this.searchResults?.querySelectorAll(
      ".search-result-link",
    );
    const totalResults = resultsLinks?.length || 0;

    switch (event.key) {
      case "Escape":
        this.handleEscape();
        break;

      case "ArrowDown":
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, totalResults - 1);
        this.updateSelection();
        break;

      case "ArrowUp":
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection();
        break;

      case "Enter":
        event.preventDefault();
        if (this.selectedIndex >= 0 && resultsLinks) {
          const selectedLink =
            resultsLinks[this.selectedIndex] as HTMLAnchorElement;
          if (selectedLink) {
            this.hideResults();
            // Navigate to the selected result
            globalThis.location.href = selectedLink.href;
          }
        }
        break;
    }
  }

  updateSelection() {
    const resultsLinks = this.searchResults?.querySelectorAll(
      ".search-result-link",
    );
    if (!resultsLinks) return;

    // Remove previous selection
    resultsLinks.forEach((link, index) => {
      link.classList.remove("bg-blue-50", "dark:bg-blue-900/20");
      if (index === this.selectedIndex) {
        link.classList.add("bg-blue-50", "dark:bg-blue-900/20");
        // Scroll the selected item into view
        link.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;

    // Don't hide results if clicking on a search result link
    if (target.closest(".search-result-link")) {
      return;
    }

    // Check if click is outside the search container
    const searchContainer = document.getElementById("orama-search-results");
    if (
      !this.searchInput?.parentElement?.contains(target) &&
      !searchContainer?.contains(target)
    ) {
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
        term,
        mode: "fulltext",
        limit: 8,
        threshold: 1,
        properties: ["title", "content", "description"],
        datasources: ["0fe1e86b-60c9-4715-8bba-0c4686a58e7e"],
        boost: {
          title: 12,
          content: 4,
          description: 2,
        },
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
        <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
          <h3 class="text-sm font-semibold text-foreground-primary">Search Results</h3>
        </div>
        <div class="p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 text-foreground-tertiary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <p class="text-sm font-medium text-foreground-primary mb-1">No results found</p>
          <p class="text-xs text-foreground-secondary">Try different keywords or check your spelling</p>
        </div>
      `;
      return;
    }

    // Filter out results that don't have valid URLs or paths
    const validResults = results.hits.filter((hit) => {
      // First check basic requirements
      if (!hit.document) return false;

      // Check if it has valid URL/path or can be constructed
      const hasValidUrl = hit.document.url || hit.document.path ||
        hit.document.title || hit.id;
      if (!hasValidUrl) return false;

      // Filter out navigation/menu content
      if (this.isNavigationContent(hit)) {
        return false;
      }

      return true;
    })
      // Sort by content quality - prefer longer, more substantial content
      .sort((a, b) => {
        const scoreA = this.getContentScore(a, searchTerm);
        const scoreB = this.getContentScore(b, searchTerm);
        return scoreB - scoreA; // Higher score first
      });

    const resultsHtml = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-foreground-primary" id="search-results__heading">Search Results</h2>
          <span class="text-xs text-foreground-secondary">${validResults.length} result${
      validResults.length !== 1 ? "s" : ""
    }</span>
        </div>
      </div>
      <ul aria-labelledby="search-results__heading">
        ${
      validResults.map((hit) => `
        <li>
          <a
            href="${this.escapeHtml(this.formatUrl(hit.document.url, hit))}"
            class="flex flex-col px-4 py-3 hover:bg-foreground-quaternary transition-colors duration-150 border-b border-foreground-quaternary last:border-b-0 search-result-link group"
          >
            <div class="font-bold text-foreground-primary text-sm mb-2 group-hover:text-primary transition-colors">
              ${
        this.highlightMatch(
          this.escapeHtml(this.cleanTitle(hit.document.title)),
          searchTerm,
        )
      }
            </div>
            <div class="pl-3 border-l border-foreground-quaternary text-sm text-foreground-secondary leading-relaxed mb-2 line-clamp-3">
              ${
        this.highlightMatch(
          this.escapeHtml(hit.document.content.slice(0, 200)) + "...",
          searchTerm,
        )
      }
            </div>
            <div class="flex items-center text-xs text-gray-500 dark:color-gray-600">
              <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              ${this.escapeHtml(this.formatUrl(hit.document.url, hit))}
            </div>
          </a>
        </li>
      `).join("")
    }
      </ul>
    `;

    this.searchResults.innerHTML = resultsHtml;

    // Reset selection for new results
    this.selectedIndex = -1;

    if (this.ariaLiveRegion) {
      this.ariaLiveRegion.textContent =
        `${validResults.length} results found for "${searchTerm}"`;
    }
  }

  showNotConfiguredMessage() {
    if (!this.searchResults) return;

    this.searchResults.innerHTML = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <h3 class="text-sm font-semibold text-foreground-primary">Search</h3>
      </div>
      <div class="p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 text-foreground-tertiary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <p class="text-sm font-medium text-foreground-primary mb-1">Search not configured</p>
        <p class="text-xs text-foreground-secondary">Please add your Orama credentials</p>
      </div>
    `;
    this.showResults();
  }

  showErrorMessage(message: string) {
    if (!this.searchResults) return;

    this.searchResults.innerHTML = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <h3 class="text-sm font-semibold text-foreground-primary">Search Error</h3>
      </div>
      <div class="p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-sm font-medium text-foreground-primary mb-1">${
      this.escapeHtml(message)
    }</p>
        <p class="text-xs text-foreground-secondary">Please try again or contact support</p>
      </div>
    `;
    this.showResults();
  }

  showResults() {
    const resultsContainer = document.getElementById("orama-search-results");
    if (resultsContainer) {
      resultsContainer.classList.remove("hidden");
      this.isResultsOpen = true;
    }
  }

  hideResults() {
    const resultsContainer = document.getElementById("orama-search-results");
    if (resultsContainer) {
      resultsContainer.classList.add("hidden");
      this.isResultsOpen = false;
      this.selectedIndex = -1; // Reset selection when hiding
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
      '<mark class="bg-runtime px-[1px] py-0.5 rounded text-black font-bold">$1</mark>',
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
      // Clean up the path by removing "jump to heading" text
      const cleanPath = this.cleanUrl(hit.document.path);
      return this.formatUrl(cleanPath);
    }

    // Handle undefined or null URLs
    if (!url) {
      // Try to construct URL from other fields
      if (hit && hit.document) {
        // Check if there's an ID that might be a path
        if (hit.id && typeof hit.id === "string") {
          return this.formatUrl(hit.id);
        }

        // Try to construct from title (this is a fallback)
        if (hit.document.title) {
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

    // Clean the URL first
    const cleanedUrl = this.cleanUrl(url);

    // If it's already a full URL, return as-is
    if (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://")) {
      return cleanedUrl;
    }

    // If it starts with '/', it's a root-relative path
    if (cleanedUrl.startsWith("/")) {
      return cleanedUrl;
    }

    // Otherwise, make it root-relative
    return "/" + cleanedUrl;
  }

  // Helper method to clean URLs by removing unwanted text
  cleanUrl(url: string): string {
    // Remove "jump to heading" and similar text patterns
    let cleaned = url
      .replace(/\s*jump\s+to\s+heading\s*/gi, "")
      .replace(/\s*#jump-to-heading\s*/gi, "")
      .replace(/\s*-jump-to-heading\s*/gi, "")
      .trim();

    // Remove any trailing or leading hashes that might be left
    cleaned = cleaned.replace(/^#+|#+$/g, "");

    // If the URL became empty or just whitespace, return the original
    if (!cleaned || cleaned.trim() === "") {
      return url;
    }

    return cleaned;
  }

  // Helper method to clean titles by removing unwanted text
  cleanTitle(title: string): string {
    if (!title) return title;

    // Remove "jump to heading" and similar text patterns from titles
    let cleaned = title
      .replace(/\s*Jump\s+to\s+heading\s*/gi, "")
      .replace(/\s*#Jump-to-heading\s*/gi, "")
      .replace(/\s*-Jump-to-heading\s*/gi, "")
      .replace(/Jump\s+to\s+heading#?/gi, "")
      .replace(/#Jump-to-heading/gi, "")
      .replace(/-Jump-to-heading/gi, "")
      .trim();

    // Remove any trailing or leading hashes, pipes, or other separators
    cleaned = cleaned.replace(/^[#\|\-\s]+|[#\|\-\s]+$/g, "");

    // If the title became empty or just whitespace, return the original
    if (!cleaned || cleaned.trim() === "") {
      return title;
    }

    return cleaned;
  }

  // Helper method to detect navigation/menu content
  isNavigationContent(hit: SearchResult): boolean {
    if (!hit.document) return false;

    const title = hit.document.title?.toLowerCase() || "";
    const content = hit.document.content?.toLowerCase() || "";
    const section = hit.document.section?.toLowerCase() || "";
    const category = hit.document.category?.toLowerCase() || "";

    // Navigation indicators in titles
    const navTitlePatterns = [
      /^(home|menu|navigation|nav|sidebar|header|footer)$/,
      /^(getting started|quick start|overview)$/,
      /^(table of contents|toc)$/,
      /^(breadcrumb|breadcrumbs)$/,
    ];

    // Navigation indicators in content
    const navContentPatterns = [
      /^(home|menu|navigation|nav|sidebar|header|footer|skip to|jump to)$/,
      /^\s*(getting started|quick start|overview|table of contents|toc|breadcrumb)\s*$/,
      /^\s*\|\s*$/, // Just pipe characters (common in nav separators)
      /^(previous|next|back|continue)$/,
    ];

    // Check for very short content that's likely navigation
    if (
      content.length < 50 && (
        navContentPatterns.some((pattern) => pattern.test(content)) ||
        navTitlePatterns.some((pattern) => pattern.test(title))
      )
    ) {
      return true;
    }

    // Check if section/category indicates navigation
    const navSections = [
      "navigation",
      "nav",
      "menu",
      "sidebar",
      "header",
      "footer",
      "breadcrumb",
    ];
    if (navSections.includes(section) || navSections.includes(category)) {
      return true;
    }

    // Check for content that's mostly just links/navigation words
    const navWords = [
      "home",
      "about",
      "docs",
      "api",
      "guide",
      "tutorial",
      "reference",
      "examples",
    ];
    const words = content.split(/\s+/).filter((w) => w.length > 2);
    if (words.length <= 5 && words.every((word) => navWords.includes(word))) {
      return true;
    }

    return false;
  }

  // Helper method to score content quality
  getContentScore(hit: SearchResult, term?: string): number {
    if (!hit.document) return 0;

    let score = hit.score || 0; // Start with Orama's relevance score

    // Bonus for longer content (indicates substantial content)
    const contentLength = hit.document.content?.length || 0;
    if (contentLength > 200) score += 2;
    if (contentLength > 500) score += 3;
    if (contentLength > 1000) score += 5;

    // Bonus for titles that seem to be real page titles
    const title = hit.document.title || "";
    if (title.length > 10 && title.length < 100) score += 1;

    // Penalty for very short content
    if (contentLength < 50) score -= 5;

    // Bonus for certain sections that indicate main content
    const section = hit.document.section?.toLowerCase() || "";
    const category = hit.document.category?.toLowerCase() || "";

    const contentSections = [
      "guide",
      "tutorial",
      "reference",
      "api",
      "documentation",
      "docs",
    ];
    if (
      contentSections.some((s) => section.includes(s) || category.includes(s))
    ) {
      score += 3;
    }

    // Boost CLI command pages when term contains a matching command
    const t = (term || "").toLowerCase().trim();
    const docKind = hit.document.kind?.toLowerCase();
    const cmd = hit.document.command?.toLowerCase();
    const titleLower = title.toLowerCase();
    const path = (hit.document.path || hit.document.url || "").toLowerCase();

    // Simple query normalization: strip leading "deno "
    const normalized = t.replace(/^deno\s+/, "");

    if (docKind === "cli") {
      // Strong boost if command matches
      if (
        cmd &&
        (normalized === cmd || t === cmd ||
          titleLower.includes(`deno ${cmd}`) || path.endsWith(`/cli/${cmd}`))
      ) {
        score += 25;
      }
      // Moderate boost for any CLI page when the query starts with "deno"
      if (t.startsWith("deno ")) {
        score += 8;
      }
    }

    // Penalize anchor/heading-only hits that contain a hash but not the page root
    if (path.includes("#") && !/\/reference\/cli\//.test(path)) {
      score -= 6;
    }

    return score;
  }
}

// Initialize search when the script loads
const oramaSearch = new OramaSearch();

// Make it globally available for onclick handlers
declare global {
  var oramaSearch: OramaSearch;
}

globalThis.oramaSearch = oramaSearch;

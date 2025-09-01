// Orama Search Client
// This handles the client-side search functionality for the Deno docs with AI Context Engineering

import type { Hit, OramaCloud, SearchResult } from "jsr:@orama/core@1.2.4";

interface OramaDocument {
  title: string;
  content: string;
  url?: string;
  path?: string;
  category?: string;
  section?: string;
  kind?: string;
  command?: string;
}

interface AISession {
  answer: (params: { query: string }) => Promise<string>;
  answerStream: (params: { query: string }) => AsyncIterable<string>;
  state: unknown[];
  abort: () => void | Promise<void>;
}

// Configuration - Replace these with your actual Orama Cloud credentials
const ORAMA_CONFIG = {
  projectId: "c9394670-656a-4f78-a551-c2603ee119e7",
  apiKey: "c1_E4q2kmwSiWpPYzeIzP38VyHmekjnZUJL3yB7Kprr8$YF-u_cXBSn3u0-AvX",
};

class OramaSearch {
  private client: OramaCloud | null = null;
  private searchInput: HTMLInputElement | null = null;
  private searchInputModal: HTMLInputElement | null = null;
  private searchModal: HTMLElement | null = null;
  private searchBackdrop: HTMLElement | null = null;
  private searchResults: HTMLElement | null = null;
  private searchLoading: HTMLElement | null = null;
  private ariaLiveRegion: HTMLElement | null = null;
  private searchTimeout: number | null = null;
  private isModalOpen = false;
  private selectedIndex = -1; // Track selected result for keyboard navigation
  private aiSession: AISession | null = null;
  private currentAiSearch: AbortController | null = null;
  private isAiMode = false; // Toggle between regular and AI search

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
    this.searchInputModal = document.getElementById(
      "orama-search-input-modal",
    ) as HTMLInputElement;
    this.searchModal = document.getElementById("orama-search-modal");
    this.searchBackdrop = document.getElementById("search-backdrop");
    this.searchResults = document.getElementById(
      "orama-search-results-content",
    );
    this.searchLoading = document.getElementById("orama-search-loading");
    this.ariaLiveRegion = document.getElementById("orama-results-announcer");

    if (!this.searchInput || !this.searchInputModal) {
      console.warn("Orama search inputs not found");
      return;
    }

    // Initialize search mode UI
    this.updateSearchMode();

    // Make the trigger input readonly and add click handler to open modal
    this.searchInput.setAttribute("readonly", "true");
    this.searchInput.addEventListener("click", () => {
      this.openSearchModal();
    });

    // Set up modal input handlers
    this.searchInputModal.addEventListener(
      "input",
      this.handleInput.bind(this),
    );
    this.searchInputModal.addEventListener(
      "keydown",
      this.handleKeyDown.bind(this),
    );

    // Add backdrop click handler to close modal
    this.searchBackdrop?.addEventListener("click", () => {
      this.hideResults();
    });

    // Add click handler to mode toggle button
    const modeToggle = document.getElementById("search-mode-toggle");
    modeToggle?.addEventListener("click", () => {
      this.toggleSearchMode();
    });

    // Finish setting up global handlers
    this.finishElementSetup();
  }

  openSearchModal() {
    this.showResults();
    // Focus the modal input
    setTimeout(() => {
      this.searchInputModal?.focus();
    }, 100);
  }

  finishElementSetup() {
    // Set up global keyboard handlers
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        this.openSearchModal();
      }
      // Add shortcut for AI mode toggle (Ctrl+Shift+K or Cmd+Shift+K)
      if (
        (event.metaKey || event.ctrlKey) && event.shiftKey && event.key === "K"
      ) {
        event.preventDefault();
        this.toggleSearchMode();
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

      // Initialize AI session for context engineering
      await this.initAISession();

      console.log("Orama search client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Orama client:", error);
      this.showErrorMessage("Failed to initialize search");
    }
  }

  async initAISession() {
    if (!this.client) return;

    try {
      // Create AI session with context engineering capabilities
      this.aiSession = await this.client.ai.createAISession({
        events: {
          onStateChange: (state) => {
            console.log("AI Session state changed:", state);
          },
        },
        LLMConfig: {
          provider: "openai",
          model: "gpt-4o-mini", // Use a fast, efficient model for search assistance
        },
      }) as AISession;
      console.log("AI session initialized for context engineering");
    } catch (error) {
      console.warn("AI session initialization failed:", error);
      // Continue without AI features if they fail to initialize
    }
  }

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Abort any ongoing AI search immediately when user types
    if (this.currentAiSearch) {
      this.currentAiSearch.abort();
      this.currentAiSearch = null;
    }

    if (!value.trim()) {
      // Clear results but keep modal open
      if (this.searchResults) {
        this.searchResults.innerHTML = "";
      }
      return;
    }

    // Reset selection when user types
    this.selectedIndex = -1;

    // Use longer debounce for AI mode since it's more expensive
    // Regular search: 300ms, AI search: 500ms to prevent flashing results
    const debounceTime = this.isAiMode ? 500 : 300;

    this.searchTimeout = setTimeout(() => {
      this.performSearch(value);
    }, debounceTime);
  }

  handleFocus() {
    // No longer needed since we use modal
  }

  handleEscape() {
    this.hideResults();
    if (this.searchInputModal) {
      this.searchInputModal.value = ""; // Clear modal input when escape is triggered
    }
    this.selectedIndex = -1;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.isModalOpen) {
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
      link.classList.remove(
        "bg-gray-50",
        "dark:bg-gray-800",
        "text-gray-900",
        "dark:text-white",
      );
      if (index === this.selectedIndex) {
        link.classList.add(
          "bg-gray-50",
          "dark:bg-gray-800",
          "text-gray-900",
          "dark:text-white",
        );
        // Scroll the selected item into view
        link.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;

    // Don't hide modal if clicking on a search result link
    if (target.closest(".search-result-link")) {
      return;
    }

    // Check if click is outside the search modal content
    const searchModal = document.getElementById("orama-search-modal");
    const modalContent = searchModal?.querySelector("div"); // The inner content div

    if (this.isModalOpen && modalContent && !modalContent.contains(target)) {
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
      if (this.isAiMode && this.aiSession) {
        await this.performAISearch(term);
      } else {
        await this.performRegularSearch(term);
      }
    } catch (error) {
      console.error("Search error:", error);
      this.showErrorMessage("Search failed. Please try again.");
    } finally {
      this.showLoading(false);
    }
  }

  async performRegularSearch(term: string) {
    const results = await this.client!.search({
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

    this.renderResults(
      results as unknown as SearchResult<OramaDocument>,
      term,
    );
    this.showResults();
  }

  async performAISearch(term: string) {
    if (!this.aiSession) {
      await this.performRegularSearch(term);
      return;
    }

    // Abort any existing AI search before starting new one
    if (this.currentAiSearch) {
      this.currentAiSearch.abort();
    }
    this.currentAiSearch = new AbortController();

    // Show AI loading state
    this.renderAILoading(term);
    this.showResults();

    try {
      let response = "";
      let sources: OramaDocument[] = [];
      let lastResponse = "";

      // Stream the AI response with abort check
      for await (const chunk of this.aiSession.answerStream({ query: term })) {
        // Check if search was aborted
        if (this.currentAiSearch.signal.aborted) {
          return; // Exit early if aborted
        }

        // Chunks from Orama are cumulative (contain full response so far)
        response = String(chunk);

        // Only re-render if response has actually changed and not aborted
        if (response !== lastResponse && !this.currentAiSearch.signal.aborted) {
          this.renderAIResponse(term, response, sources, true);
          lastResponse = response;
        }
      }

      // Only proceed with final rendering if not aborted
      if (!this.currentAiSearch.signal.aborted) {
        // Get the final state to extract sources
        const sessionState = this.aiSession.state;
        if (sessionState && sessionState.length > 0) {
          const latestInteraction = sessionState[sessionState.length - 1] as {
            sources?: OramaDocument[];
          };
          sources = latestInteraction.sources || [];
        }

        // Render final result
        this.renderAIResponse(term, response, sources, false);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("AI search error:", error);
        this.renderAIError(
          term,
          "AI search failed. Falling back to regular search.",
        );
        await this.performRegularSearch(term);
      }
    }
  }

  renderResults(results: SearchResult<OramaDocument>, searchTerm: string) {
    if (!this.searchResults) return;

    if (results.hits.length === 0) {
      this.searchResults.innerHTML = `
        <div class="px-4 py-8 text-center">
          <div class="w-12 h-12 mx-auto mb-4 text-foreground-tertiary">
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
      // Sort by Orama's relevance score
      .sort((a, b) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA; // Higher score first
      });

    const resultsHtml = `
      ${
      validResults.map((hit, index) => `
        <a
          href="${this.escapeHtml(this.formatUrl(hit.document.url, hit))}"
          class="group flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm search-result-link hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          id="search-result-${index}"
        >
          <div class="flex-auto">
            <div class="font-medium text-foreground-primary mb-1">
              ${
        this.highlightMatch(
          this.escapeHtml(this.cleanTitle(hit.document.title)),
          searchTerm,
        )
      }
            </div>
            <div class="text-xs text-foreground-secondary line-clamp-2">
              ${
        this.highlightMatch(
          this.escapeHtml(hit.document.content.slice(0, 120)) + "...",
          searchTerm,
        )
      }
            </div>
            <div class="flex items-center text-xs text-foreground-tertiary mt-1">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              ${
        this.escapeHtml(
          this.formatUrl(hit.document.url, hit).replace(
            /^https?:\/\/[^\/]+/,
            "",
          ),
        )
      }
            </div>
          </div>
          <div class="ml-3 flex-none text-xs font-semibold text-foreground-tertiary">
            ↵
          </div>
        </a>
      `).join("")
    }
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

  renderAILoading(searchTerm: string) {
    if (!this.searchResults) return;

    this.searchResults.innerHTML = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-foreground-primary flex items-center gap-2">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            AI Search Results
          </h2>
        </div>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-r-primary"></div>
          <div class="text-sm text-foreground-secondary">
            Analyzing your query with AI context engineering...
          </div>
        </div>
        <div class="bg-background-secondary rounded-lg p-4 border-l-4 border-primary">
          <p class="text-sm text-foreground-secondary mb-2">
            <strong>Query:</strong> ${this.escapeHtml(searchTerm)}
          </p>
          <p class="text-xs text-foreground-tertiary">
            Using advanced context engineering to provide the most relevant and helpful response.
          </p>
        </div>
      </div>
    `;
  }

  renderAIResponse(
    searchTerm: string,
    response: string,
    sources: OramaDocument[],
    isStreaming: boolean,
  ) {
    if (!this.searchResults) return;

    const streamingIndicator = isStreaming
      ? `<div class="animate-pulse inline-block w-2 h-4 bg-primary rounded ml-1"></div>`
      : "";

    const sourcesHtml = sources.length > 0
      ? `
      <div class="mt-6 border-t border-foreground-quaternary pt-4">
        <h3 class="text-sm font-semibold text-foreground-primary mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Sources (${sources.length})
        </h3>
        <div class="grid gap-2">
          ${
        sources.slice(0, 3).map((source) => `
            <a href="${
          this.escapeHtml(
            this.formatUrl(
              source.url,
              { document: source } as Hit<OramaDocument>,
            ),
          )
        }" 
               class="block p-3 rounded-lg bg-background-secondary hover:bg-foreground-quaternary transition-colors border border-foreground-quaternary group">
              <div class="text-sm font-medium text-foreground-primary group-hover:text-primary transition-colors">
                ${this.escapeHtml(source.title || "Untitled")}
              </div>
              <div class="text-xs text-foreground-secondary mt-1 line-clamp-2">
                ${this.escapeHtml(source.content?.slice(0, 120) || "")}...
              </div>
            </a>
          `).join("")
      }
        </div>
      </div>
    `
      : "";

    this.searchResults.innerHTML = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-foreground-primary flex items-center gap-2">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            AI Search Results
          </h2>
        </div>
      </div>
      <div class="p-6">
        <div class="bg-background-secondary rounded-lg p-4 border-l-4 border-primary mb-4">
          <p class="text-sm text-foreground-secondary mb-2">
            <strong>Your Question:</strong> ${this.escapeHtml(searchTerm)}
          </p>
        </div>
        <div class="prose prose-sm max-w-none text-foreground-primary">
          <div class="leading-relaxed">
            ${this.escapeHtml(response)}${streamingIndicator}
          </div>
        </div>
        ${sourcesHtml}
        <div class="mt-4 pt-4 border-t border-foreground-quaternary">
          <button onclick="oramaSearch.toggleSearchMode()" class="text-xs text-primary hover:text-primary-dark transition-colors">
            ← Switch to regular search
          </button>
        </div>
      </div>
    `;

    // Reset selection for new results
    this.selectedIndex = -1;

    if (this.ariaLiveRegion) {
      this.ariaLiveRegion.textContent =
        `AI response provided for "${searchTerm}"`;
    }
  }

  renderAIError(_searchTerm: string, errorMessage: string) {
    if (!this.searchResults) return;

    this.searchResults.innerHTML = `
      <div class="p-4 border-b border-foreground-tertiary bg-background-secondary">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-foreground-primary flex items-center gap-2">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            AI Search Error
          </h2>
        </div>
      </div>
      <div class="p-6">
        <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500 mb-4">
          <p class="text-sm text-red-700 dark:text-red-300">
            ${this.escapeHtml(errorMessage)}
          </p>
        </div>
        <button onclick="oramaSearch.toggleSearchMode()" class="text-xs text-primary hover:text-primary-dark transition-colors">
          ← Switch to regular search
        </button>
      </div>
    `;
  }

  toggleSearchMode() {
    this.isAiMode = !this.isAiMode;

    // Clear any pending search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    // Abort any ongoing AI search
    if (this.currentAiSearch) {
      this.currentAiSearch.abort();
      this.currentAiSearch = null;
    }

    // Update UI to reflect the mode change
    this.updateSearchMode();

    // If there's a current search term, re-run the search with the new mode
    if (this.searchInputModal?.value.trim()) {
      this.performSearch(this.searchInputModal.value.trim());
    }
  }

  updateSearchMode() {
    // Update trigger input
    if (this.searchInput) {
      if (this.isAiMode) {
        this.searchInput.placeholder = "Ask AI about Deno docs...";
        this.searchInput.classList.add("ai-mode");
      } else {
        this.searchInput.placeholder = "Search documentation...";
        this.searchInput.classList.remove("ai-mode");
      }
    }

    // Update modal input
    if (this.searchInputModal) {
      if (this.isAiMode) {
        this.searchInputModal.placeholder = "Ask AI about Deno docs...";
      } else {
        this.searchInputModal.placeholder = "Search documentation...";
      }
    }

    // Update modal UI elements
    this.updateModalSearchMode();
  }

  updateModalSearchMode() {
    const modal = document.getElementById("orama-search-modal");
    const modeIcon = document.getElementById("search-mode-icon");
    const modeText = document.getElementById("search-mode-text");
    const toggleButton = document.getElementById("search-mode-toggle");

    if (modal) {
      if (this.isAiMode) {
        modal.classList.add("ai-mode");
      } else {
        modal.classList.remove("ai-mode");
      }
    }

    if (modeIcon && modeText) {
      if (this.isAiMode) {
        modeIcon.textContent = "💡";
        modeText.textContent = "AI On";
      } else {
        modeIcon.textContent = "🚫";
        modeText.textContent = "AI Off";
      }
    }

    if (toggleButton) {
      toggleButton.title = this.isAiMode
        ? "Switch to regular search (Ctrl+Shift+K)"
        : "Switch to AI search (Ctrl+Shift+K)";
    }
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
    const modal = document.getElementById("orama-search-modal");
    const backdrop = document.getElementById("search-backdrop");
    if (modal && backdrop) {
      modal.classList.remove("hidden");
      backdrop.classList.remove("hidden");
      this.isModalOpen = true;
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
  }

  hideResults() {
    const modal = document.getElementById("orama-search-modal");
    const backdrop = document.getElementById("search-backdrop");
    if (modal && backdrop) {
      modal.classList.add("hidden");
      backdrop.classList.add("hidden");
      this.isModalOpen = false;
      this.selectedIndex = -1; // Reset selection when hiding

      // Clean up any ongoing operations
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      }

      if (this.currentAiSearch) {
        this.currentAiSearch.abort();
        this.currentAiSearch = null;
      }

      // Restore body scrolling
      document.body.style.overflow = "";
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
  formatUrl(url: string | undefined, hit?: Hit<OramaDocument>): string {
    // First try to use the path field if available (this should be a clean relative path)
    if (hit && hit.document && hit.document.path) {
      const path = this.cleanUrl(hit.document.path);

      // Check if the original URL has an anchor that we should preserve
      if (url && url.includes("#")) {
        const anchorMatch = url.match(/#[^#]*$/);
        if (anchorMatch) {
          const anchor = anchorMatch[0];
          // Only add anchor if it's not a "jump-to-heading" artifact
          if (
            !anchor.includes("jump-to-heading") &&
            !anchor.includes("Jump-to-heading")
          ) {
            const cleanPath = path.startsWith("/") ? path : "/" + path;
            return cleanPath + anchor;
          }
        }
      }

      // If it starts with '/', it's already a root-relative path
      if (path.startsWith("/")) {
        return path;
      }
      // Otherwise, make it root-relative
      return "/" + path;
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

    // If it's already a full URL, extract just the path part (including anchor)
    if (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://")) {
      try {
        const urlObj = new URL(cleanedUrl);
        return urlObj.pathname + urlObj.hash;
      } catch {
        // If URL parsing fails, fall back to original logic
        return cleanedUrl;
      }
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
      .replace(/#jump-to-heading/gi, "")
      .replace(/-jump-to-heading/gi, "")
      .trim();

    // Remove empty hash fragments or multiple hashes, but preserve legitimate anchors
    cleaned = cleaned.replace(/#+$/, ""); // Remove trailing empty hashes
    cleaned = cleaned.replace(/^#+/, ""); // Remove leading hashes only if they're standalone

    // If the URL became empty or just whitespace, return the original
    if (!cleaned || cleaned.trim() === "") {
      return url;
    }

    return cleaned;
  }

  // Helper method to clean titles by removing unwanted text
  cleanTitle(title: string): string {
    if (!title) return title;

    // Handle breadcrumb-style titles with intelligent processing
    if (title.includes("\\")) {
      return this.processBreadcrumbTitle(title);
    }

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

  // Process breadcrumb-style titles intelligently
  processBreadcrumbTitle(title: string): string {
    if (!title) return title;

    // Split by common path separators
    const parts = title.split(/[\\\/\|>]+/).map((part) => part.trim()).filter(
      (part) => part,
    );

    if (parts.length <= 1) return title;

    // Get the last meaningful part (not "Index")
    let lastPart = parts[parts.length - 1];
    if (lastPart.toLowerCase() === "index" && parts.length > 1) {
      lastPart = parts[parts.length - 2];
    }

    // Handle specific known patterns where we want to preserve more context
    const contextualMappings: Record<string, string> = {
      "Support": "Support and Feedback", // When we see just "Support", enhance it
    };

    // Check if this last part needs enhancement
    if (contextualMappings[lastPart]) {
      return contextualMappings[lastPart];
    }

    // For other cases, use intelligent processing
    return this.enhanceBreadcrumbPart(lastPart, parts);
  }

  // Enhance a breadcrumb part with context from the full path
  enhanceBreadcrumbPart(part: string, _fullPath: string[]): string {
    if (!part) return part;

    // Handle common acronyms that shouldn't be split
    const acronyms = [
      "API",
      "JWT",
      "HTTP",
      "HTTPS",
      "URL",
      "UUID",
      "JSON",
      "XML",
      "HTML",
      "CSS",
      "JS",
      "TS",
    ];
    if (acronyms.includes(part.toUpperCase())) {
      return part.toUpperCase();
    }

    // Convert from various formats to readable text
    let enhanced = part
      .replace(/[_-]/g, " ") // Replace underscores and hyphens with spaces
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add spaces between camelCase words
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Capitalize properly
    enhanced = enhanced.split(" ")
      .map((word) => {
        // Keep acronyms uppercase
        if (acronyms.includes(word.toUpperCase())) {
          return word.toUpperCase();
        }
        // Normal word capitalization
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");

    return enhanced;
  }

  // Helper method to detect navigation/menu content
  isNavigationContent(hit: Hit<OramaDocument>): boolean {
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
}

// Initialize search when the script loads
const oramaSearch = new OramaSearch();

// Make it globally available for onclick handlers
declare global {
  var oramaSearch: OramaSearch;
}

globalThis.oramaSearch = oramaSearch;

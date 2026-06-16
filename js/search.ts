// Orama Search Client
// This handles the client-side search functionality for the Deno docs

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

// Minimal typing for the experimental browser Prompt API (Chrome's built-in,
// on-device AI). It is feature-detected at runtime, so this is only a shape.
// https://developer.chrome.com/docs/ai/prompt-api
type LanguageModelAvailability =
  | "unavailable"
  | "downloadable"
  | "downloading"
  | "available";

interface LanguageModelSession {
  prompt(input: string): Promise<string>;
  destroy(): void;
}

interface LanguageModelStatic {
  availability(): Promise<LanguageModelAvailability>;
  create(options?: {
    initialPrompts?: {
      role: "system" | "user" | "assistant";
      content: string;
    }[];
  }): Promise<LanguageModelSession>;
}

function getLanguageModel(): LanguageModelStatic | undefined {
  return (globalThis as { LanguageModel?: LanguageModelStatic }).LanguageModel;
}

// The on-device model has a small context window, so retrieved context is kept
// compact: a handful of the top search hits, each truncated.
const ASK_MAX_HITS = 5;
const ASK_MAX_CHARS_PER_HIT = 500;
const ASK_SYSTEM_PROMPT =
  "You are the Deno documentation assistant. Answer the user's question " +
  "using only the provided context from the Deno docs. Be concise and " +
  "practical, and prefer Deno's recommended APIs. If the answer is not in " +
  "the context, say you couldn't find it in the docs and point them to the " +
  "linked pages. Never invent APIs, flags, or permissions.";

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
  // Latest query + hits, reused by the Ask AI feature as retrieval context.
  private lastTerm = "";
  private lastHits: Hit<OramaDocument>[] = [];

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
      const results = await this.client.search({
        term,
        mode: "fulltext",
        limit: 8,
        threshold: 1,
        properties: ["title", "content", "description"],
        datasources: ["b03275f5-6d98-499e-9fe5-5d704221006e"],
        boost: {
          title: 12,
          content: 4,
          description: 2,
        },
      });

      this.lastTerm = term;
      this.lastHits = results.hits as unknown as Hit<OramaDocument>[];

      this.renderResults(
        results as unknown as SearchResult<OramaDocument>,
        term,
      );
      this.showResults();
    } catch (error) {
      console.error("Search error:", error);
      this.showErrorMessage("Search failed. Please try again.");
    } finally {
      this.showLoading(false);
    }
  }

  renderResults(results: SearchResult<OramaDocument>, searchTerm: string) {
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
      // Sort by Orama's relevance score
      .sort((a, b) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA; // Higher score first
      });

    const resultsHtml = `
      <div class="p-3 border-b border-foreground-tertiary bg-background-secondary">
        <button
          type="button"
          id="ask-ai-button"
          class="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-left text-foreground-primary border border-foreground-tertiary hover:border-primary hover:text-primary transition-colors duration-150 cursor-pointer"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>Ask AI about “${this.escapeHtml(searchTerm)}”</span>
        </button>
        <div id="ask-ai-answer" class="hidden mt-3"></div>
      </div>
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
            href="${
        this.escapeHtml(hit.document.url || hit.document.path || "#")
      }"
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
              ${this.escapeHtml(hit.document.url || hit.document.path || "")}
            </div>
          </a>
        </li>
      `).join("")
    }
      </ul>
    `;

    this.searchResults.innerHTML = resultsHtml;

    const askButton = this.searchResults.querySelector("#ask-ai-button");
    askButton?.addEventListener("click", () => this.runAsk());

    // Reset selection for new results
    this.selectedIndex = -1;

    if (this.ariaLiveRegion) {
      this.ariaLiveRegion.textContent =
        `${validResults.length} results found for "${searchTerm}"`;
    }
  }

  // Build a compact context block from the current search hits, kept small
  // for the on-device model's limited context window.
  private buildAskContext(): string {
    return this.lastHits
      .slice(0, ASK_MAX_HITS)
      .map((hit) => {
        const url = hit.document.url || hit.document.path || "";
        const title = this.cleanTitle(hit.document.title);
        const body = (hit.document.content || "").slice(
          0,
          ASK_MAX_CHARS_PER_HIT,
        );
        return `## ${title} (${url})\n${body}`;
      })
      .join("\n\n");
  }

  private renderAskAnswer(answerEl: HTMLElement, answerText: string) {
    const sources = this.lastHits
      .slice(0, ASK_MAX_HITS)
      .map((hit) => {
        const url = hit.document.url || hit.document.path || "#";
        const title = this.cleanTitle(hit.document.title);
        return `<li><a class="text-primary hover:underline" href="${
          this.escapeHtml(url)
        }">${this.escapeHtml(title)}</a></li>`;
      })
      .join("");
    answerEl.innerHTML = `
      <div class="text-sm text-foreground-primary leading-relaxed whitespace-pre-wrap">${
      this.escapeHtml(answerText)
    }</div>
      <p class="mt-3 text-xs font-semibold text-foreground-secondary">Sources</p>
      <ul class="mt-1 text-xs space-y-0.5 !pl-0 !list-none">${sources}</ul>
      <p class="mt-2 text-xs text-foreground-tertiary">AI-generated from the Deno docs. Verify against the linked pages.</p>
    `;
  }

  // When no on-device model is available, hand off to Claude with the question
  // and the most relevant doc links prefilled.
  private renderAskFallback(answerEl: HTMLElement) {
    const links = this.lastHits
      .slice(0, ASK_MAX_HITS)
      .map((h) => h.document.url || h.document.path || "")
      .filter(Boolean)
      .map((u) => `https://docs.deno.com${u}`);
    const prompt =
      `Answer this question about Deno using these documentation pages:\n${this.lastTerm}\n\n${
        links.join("\n")
      }`;
    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
    answerEl.innerHTML = `
      <p class="text-sm text-foreground-secondary">On-device AI isn't available in this browser. Ask Claude with the most relevant pages prefilled:</p>
      <a class="inline-flex items-center gap-2 mt-2 text-sm text-primary hover:underline" href="${claudeUrl}" target="_blank" rel="noreferrer">Open in Claude &rarr;</a>
    `;
  }

  // Synthesize an answer from the current search hits using the browser's
  // built-in on-device model, falling back to a Claude hand-off otherwise.
  async runAsk() {
    const answerEl = this.searchResults?.querySelector(
      "#ask-ai-answer",
    ) as HTMLElement | null;
    if (!answerEl || this.lastHits.length === 0) return;
    answerEl.classList.remove("hidden");

    const languageModel = getLanguageModel();
    if (!languageModel) {
      this.renderAskFallback(answerEl);
      return;
    }

    answerEl.innerHTML =
      `<p class="text-sm text-foreground-secondary">Thinking&hellip;</p>`;
    try {
      const availability = await languageModel.availability();
      if (availability !== "available") {
        this.renderAskFallback(answerEl);
        return;
      }
      const session = await languageModel.create({
        initialPrompts: [{ role: "system", content: ASK_SYSTEM_PROMPT }],
      });
      const answer = await session.prompt(
        `Question: ${this.lastTerm}\n\nContext:\n${this.buildAskContext()}`,
      );
      session.destroy();
      this.renderAskAnswer(answerEl, answer);
    } catch (error) {
      console.error("Ask AI error:", error);
      this.renderAskFallback(answerEl);
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

  // Helper method to clean titles by removing unwanted text
  cleanTitle(title: string): string {
    if (!title) return title;

    // Remove "jump to heading" patterns with any combination of spaces, dashes, and/or hashes
    let cleaned = title
      .replace(/[\s#-]*jump to heading[\s#-]*/gi, "")
      .trim();

    // Remove any trailing or leading hashes
    cleaned = cleaned.replace(/^#+|#+$/g, "");

    // If the title became empty, return the original
    if (!cleaned || cleaned.trim() === "") {
      return title;
    }

    return cleaned;
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

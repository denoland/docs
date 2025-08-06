/**
 * Orama Search Configuration for Deno Docs
 *
 * This file contains configuration examples and documentation for setting up
 * Orama search. The actual indexing configuration is done in the Orama Cloud dashboard.
 *
 * Setup Process:
 * 1. Sign up at https://cloud.oramasearch.com/
 * 2. Create a new index
 * 3. Configure your data source using the examples below
 * 4. Copy your endpoint and API key to search.client.ts
 */

// These are the credentials you need to add to search.client.ts
const ORAMA_CREDENTIALS = {
  endpoint: "https://cloud.orama.run/v1/indexes/your-index-id-here",
  apiKey: "your-public-api-key-here",
};

// Recommended Web Crawler Configuration for Orama Cloud Dashboard
// Copy these settings into your Orama Cloud index configuration:

const RECOMMENDED_CRAWLER_CONFIG = {
  // Base URL to crawl
  startUrl: "https://docs.deno.com",

  // URLs to include (use these patterns in the Orama dashboard)
  includePatterns: [
    "https://docs.deno.com/runtime/**",
    "https://docs.deno.com/deploy/**",
    "https://docs.deno.com/examples/**",
    "https://docs.deno.com/api/**",
  ],

  // URLs to exclude (use these patterns in the Orama dashboard)
  excludePatterns: [
    "https://docs.deno.com/_site/**",
    "https://docs.deno.com/img/**",
    "https://docs.deno.com/fonts/**",
    "https://docs.deno.com/js/**",
  ],

  // CSS selectors to INCLUDE (main content areas only)
  // Add these in the "Content Selectors" section of Orama dashboard
  includeSelectors: [
    "main", // Main content area
    "article", // Article content
    ".content", // Content containers
    ".documentation", // Documentation sections
    "[role='main']", // ARIA main content
    ".markdown-body", // If using markdown rendering
  ],

  // CSS selectors to EXCLUDE (navigation and UI elements)
  // Add these in the "Exclude Selectors" section of Orama dashboard
  excludeSelectors: [
    "nav", // Navigation elements
    ".navigation", // Navigation classes
    ".nav", // Nav classes
    ".navbar", // Navbar
    ".sidebar", // Sidebar navigation
    ".breadcrumb", // Breadcrumbs
    ".breadcrumbs", // Breadcrumbs
    ".header", // Page headers
    ".footer", // Page footers
    ".menu", // Menu elements
    ".toc", // Table of contents
    ".table-of-contents", // Table of contents
    "[role='navigation']", // ARIA navigation
    "[role='banner']", // ARIA banner (header)
    "[role='contentinfo']", // ARIA contentinfo (footer)
    ".search", // Search components
    ".search-input", // Search inputs
    ".tabs", // Tab navigation
    ".tab-nav", // Tab navigation
    ".pagination", // Pagination
    ".social-links", // Social media links
    ".edit-page", // Edit page links
    ".github-link", // GitHub links
  ],

  // Content filtering settings
  minContentLength: 50, // Skip content shorter than 50 characters
  maxContentLength: 10000, // Limit very long content
};

// Field mapping for your documents (configure in Orama dashboard)
const FIELD_MAPPING = {
  // These fields will be created in your Orama index
  title: "string", // Page title
  content: "string", // Main content
  url: "string", // Page URL/path
  category: "string", // Content category (runtime, deploy, etc.)
  section: "string", // Section within category
  tags: "string[]", // Tags array
};

// How to configure this in Orama Cloud Dashboard:
const SETUP_INSTRUCTIONS = `
1. Go to https://cloud.oramasearch.com/
2. Create a new index
3. Choose "Web Crawler" as data source
4. Configure the crawler with these settings:

   Base URL: https://docs.deno.com
   
   Include Patterns (one per line):
   https://docs.deno.com/runtime/**
   https://docs.deno.com/deploy/**
   https://docs.deno.com/examples/**
   https://docs.deno.com/api/**
   
   Exclude Patterns (one per line):
   https://docs.deno.com/_site/**
   https://docs.deno.com/img/**
   https://docs.deno.com/fonts/**
   https://docs.deno.com/js/**
   
   Content Selectors (Include - one per line):
   main
   article
   .content
   .documentation
   [role="main"]
   
   Exclude Selectors (one per line):
   nav
   .navigation
   .sidebar
   .breadcrumb
   .header
   .footer
   .menu
   [role="navigation"]
   
   Content Filtering:
   Minimum content length: 50
   
5. Run the crawler
6. Copy your endpoint and API key to search.client.ts
`;

export {
  FIELD_MAPPING,
  ORAMA_CREDENTIALS,
  RECOMMENDED_CRAWLER_CONFIG,
  SETUP_INSTRUCTIONS,
};

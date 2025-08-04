/**
 * Example configuration for Orama search integration
 *
 * To get started:
 * 1. Sign up at https://cloud.oramasearch.com/
 * 2. Create a new index and configure your data source
 * 3. Copy your endpoint and API key from the dashboard
 * 4. Replace the values below in search.client.ts
 */

// Example configuration - replace with your actual values
const EXAMPLE_CONFIG = {
  endpoint: "https://cloud.orama.com/v1/indexes/your-index-id-here",
  apiKey: "your-public-api-key-here",
};

// Data source recommendations for Deno docs:

// Option 1: Web Crawler (Easiest)
// - URL: https://docs.deno.com
// - Include patterns: /docs/, /api/, /examples/
// - Exclude patterns: /_site/, /img/, /fonts/

// Option 2: Static JSON upload
// You can generate a JSON file with your documentation content like:
const EXAMPLE_DATA_STRUCTURE = [
  {
    id: "unique-page-id",
    title: "Page Title",
    content: "Full text content of the page...",
    url: "/relative/path/to/page",
    category: "runtime", // or "deploy", "examples", etc.
    tags: ["javascript", "typescript", "api"],
  },
  // ... more documents
];

export { EXAMPLE_CONFIG, EXAMPLE_DATA_STRUCTURE };

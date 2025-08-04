# Orama Search Configuration

This file contains the configuration for integrating Orama search into the Deno
docs.

## Getting Started with Orama

1. **Sign up for Orama Cloud**: Go to
   [https://cloud.oramasearch.com/](https://cloud.oramasearch.com/) and create
   an account.

2. **Create a new index**:
   - In the Orama dashboard, create a new index
   - Choose your data source (you'll want to crawl your website or upload your
     documentation content)

3. **Get your credentials**:
   - In your Orama dashboard, you'll find your **Endpoint URL** and **Public API
     Key**
   - These are safe to include in frontend applications

4. **Configure the search**:
   - Open `search.client.ts`
   - Replace `YOUR_ORAMA_ENDPOINT` with your actual endpoint URL
   - Replace `YOUR_ORAMA_API_KEY` with your actual public API key

## Data Sources

For the Deno docs, you have several options:

### Option 1: Web Crawler (Recommended)

- Use Orama's built-in web crawler to index your documentation site
- Go to Data Sources → Web Crawler in your Orama dashboard
- Add your site URL (e.g., `https://docs.deno.com`)
- Configure crawling rules if needed

### Option 2: Static Files

- Export your documentation content as JSON
- Upload it directly to Orama
- This gives you more control over what gets indexed

### Option 3: API Integration

- Use Orama's REST API to programmatically add/update content
- Useful if you want to integrate with your build process

## Configuration Example

In `search.client.ts`, update the ORAMA_CONFIG object:

```typescript
const ORAMA_CONFIG = {
  endpoint: "https://cloud.orama.com/v1/indexes/your-index-id",
  apiKey: "your-public-api-key-here",
};
```

## Customization

You can customize the search experience by modifying:

- **Search modes**: Change between "fulltext", "vector", or "hybrid" search
- **Result limit**: Adjust how many results to show
- **UI styling**: Modify the CSS classes in the search components
- **Result formatting**: Change how search results are displayed

## Building and Testing

After configuration:

1. Run `deno task build` to build the site
2. Run `deno task serve` to test locally
3. Try searching to verify the integration works

## Troubleshooting

- Check the browser console for any error messages
- Ensure your Orama credentials are correct
- Verify your index has been populated with data
- Make sure the search.client.js file is being loaded (check Network tab in
  DevTools)

# Orama Search Indexing for Deno Documentation

This directory contains all Orama-related scripts and configuration for generating
and uploading search indexes to Orama Cloud, providing a solution to avoid web
crawler rate limits while maintaining precise control over indexed content.

## 📁 Files in this Directory

- **`generate_orama_index.ts`** - Basic markdown content indexing
- **`generate_orama_index_full.ts`** - Comprehensive indexing (markdown + API docs)
- **`upload_orama_index.ts`** - Upload indexes to Orama Cloud using official client
- **`analyze_orama_index.ts`** - Analyze generated indexes for quality and statistics
- **`example_orama_workflow.ts`** - Example workflow and usage patterns
- **`README.md`** - This documentation file

## 🚀 Quick Start

All scripts can be run from the project root using the predefined tasks in `deno.json`.

### 1. Generate Index

**Basic markdown indexing (355 documents):**

```bash
deno task generate:orama
```

**Comprehensive indexing with API docs (5,856 documents):**

```bash
deno task generate:orama:full
```

```bash
# Generate index to static/orama-index.json
deno task generate:orama

# Or generate directly to _site directory
deno task generate:orama:site
```

### 2. Set Up Environment Variables

```bash
export ORAMA_ENDPOINT="https://cloud.orama.run/v1/indexes/your-index-id"
export ORAMA_PRIVATE_API_KEY="your-private-api-key"
```

### 3. Upload to Orama Cloud

```bash
# Upload the generated index
deno task upload:orama

# Or upload with options
deno run -A upload_orama_index.ts --batch-size=25 --clear-index
```

## Generated Index Structure

The `generate_orama_index.ts` script creates a JSON file with this structure:

```json
{
  "metadata": {
    "generatedAt": "2025-01-08T...",
    "version": "1.0.0",
    "baseUrl": "https://docs.deno.com",
    "totalDocuments": 1234,
    "stats": {
      "totalCharacters": 500000,
      "averageDocumentLength": 405,
      "categoryCounts": {...},
      "sectionCounts": {...}
    }
  },
  "documents": [
    {
      "id": "runtime-getting-started-installation",
      "title": "Installation",
      "content": "Clean markdown content without navigation...",
      "url": "https://docs.deno.com/runtime/getting_started/installation/",
      "category": "runtime",
      "section": "getting_started",
      "subsection": null,
      "description": "How to install Deno on your system",
      "tags": ["installation", "setup"],
      "headings": ["Installation", "Windows", "macOS", "Linux"],
      "lastModified": 1704673200000
    }
  ]
}
```

## What Gets Indexed

### Included Content

- **Directories**: `runtime/`, `deploy/`, `examples/`, `subhosting/`, `lint/`
- **File types**: `.md` and `.mdx` files
- **Content**: Main markdown content with frontmatter metadata

### Content Processing

- ✅ Extracts titles from frontmatter or H1 headings
- ✅ Extracts descriptions from frontmatter
- ✅ Extracts tags and categories
- ✅ Cleans markdown (removes code blocks, HTML, links)
- ✅ Extracts section headings for better search relevance
- ✅ Generates clean URLs based on file paths

### Excluded Content

- ❌ Navigation elements and sidebars (not in source files)
- ❌ Component directories (`_components/`, `_includes/`, etc.)
- ❌ Build artifacts (`_site/`, `node_modules/`)
- ❌ Configuration files (`deno.json`, `README.md`, etc.)
- ❌ Files under 50 characters (likely empty or minimal)

## Available Tasks

### Generation Tasks

```bash
# Generate index for local development
deno task generate:orama

# Generate index for production build
deno task generate:orama:site
```

### Upload Tasks

```bash
# Basic upload
deno task upload:orama

# Upload with custom options
deno run -A upload_orama_index.ts --batch-size=10 --dry-run
deno run -A upload_orama_index.ts --clear-index
deno run -A upload_orama_index.ts path/to/custom-index.json
```

## Upload Options

- `--batch-size=N` - Upload N documents per batch (default: 50)
- `--clear-index` - Clear existing index before uploading
- `--dry-run` - Preview what would be uploaded without actual upload
- `--skip-existing` - Skip documents that already exist (if supported by API)

## Environment Variables

Required for uploading:

```bash
ORAMA_ENDPOINT="https://cloud.orama.run/v1/indexes/your-index-id"
ORAMA_PRIVATE_API_KEY="your-private-api-key-here"
```

You can get these from your Orama Cloud dashboard:

1. Sign up at [Orama Cloud](https://cloud.oramasearch.com/)
2. Create a new index
3. Copy the endpoint URL and private API key

## Integration with Build Process

To automatically update the search index during deployment:

### Option 1: Generate During Build

Add to your CI/CD pipeline:

```yaml
- name: Generate Orama Index
  run: deno task generate:orama:site

- name: Upload to Orama
  env:
    ORAMA_ENDPOINT: ${{ secrets.ORAMA_ENDPOINT }}
    ORAMA_PRIVATE_API_KEY: ${{ secrets.ORAMA_PRIVATE_API_KEY }}
  run: deno task upload:orama
```

### Option 2: Static File Serving

Generate the index file and serve it statically, then use a webhook or scheduled
job to update Orama:

```bash
# Generate static index file
deno task generate:orama:site

# The file will be available at https://docs.deno.com/orama-index.json
# Use this URL with Orama's JSON data source feature
```

## Troubleshooting

### Common Issues

1. **"No files found to index"**
   - Check that you're running from the docs root directory
   - Verify the `INCLUDE_DIRS` in the script match your folder structure

2. **"Missing environment variables"**
   - Set `ORAMA_ENDPOINT` and `ORAMA_PRIVATE_API_KEY`
   - Get these from your Orama Cloud dashboard

3. **Upload failures**
   - Check your API key permissions
   - Try reducing batch size: `--batch-size=1`
   - Use `--dry-run` to test without uploading

4. **Rate limiting**
   - The script includes delays between batches
   - Reduce batch size if you hit limits
   - Contact Orama support for higher limits

### Debugging

Enable verbose logging:

```bash
# See what files are being processed
deno run -A generate_orama_index.ts | grep "Processed:"

# Test upload without sending data
deno run -A upload_orama_index.ts --dry-run

# Upload one document at a time to isolate issues
deno run -A upload_orama_index.ts --batch-size=1
```

## Comparison with Web Crawler

| Aspect                 | Web Crawler             | Direct Indexing        |
| ---------------------- | ----------------------- | ---------------------- |
| **Rate Limits**        | ❌ Subject to limits    | ✅ Controlled batching |
| **Content Control**    | ❌ May index navigation | ✅ Only main content   |
| **Freshness**          | ❌ Periodic crawling    | ✅ On-demand updates   |
| **Setup Complexity**   | ✅ Simple               | ⚠️ Requires scripts    |
| **Build Integration**  | ❌ External process     | ✅ Part of build       |
| **Content Processing** | ❌ Raw HTML             | ✅ Clean markdown      |

## Advanced Configuration

### Customizing Content Extraction

Edit `generate_orama_index.ts` to modify:

- `INCLUDE_DIRS` - Add/remove content directories
- `cleanMarkdownContent()` - Adjust content cleaning logic
- `extractHeadings()` - Change heading extraction patterns
- Document structure in `OramaDocument` interface

### Custom Upload Logic

Edit `upload_orama_index.ts` to:

- Add retry logic for failed uploads
- Implement incremental updates
- Add custom error handling
- Integrate with monitoring systems

## Files Generated

- `static/orama-index.json` - Full index with complete content
- `static/orama-index-minimal.json` - Lightweight index with content previews
- Upload logs and statistics in console output

## Next Steps

1. **Test the indexing**: Run `deno task generate:orama` to see what gets
   indexed
2. **Set up Orama Cloud**: Create an index and get your API credentials
3. **Upload test data**: Use `--dry-run` first, then upload a small batch
4. **Integrate with CI/CD**: Add to your deployment pipeline
5. **Monitor performance**: Check search quality and update frequency

For more help, see the [Orama documentation](https://docs.oramasearch.com/) or
check the configuration examples in `orama.config.ts`.

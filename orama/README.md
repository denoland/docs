# Orama Search Indexing for Deno Documentation

This directory contains all Orama-related scripts and configuration for generating
and uploading search indexes to Orama Cloud, providing a solution to avoid web
crawler rate limits while maintaining precise control over indexed content.

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

### 2. Upload to Orama Cloud

```bash
# Upload and deploy
deno task upload:orama static/orama-index-full.json --deploy

# Or just upload without deploying
deno task upload:orama static/orama-index-full.json
```

## Automated CI/CD Deployment

The repository includes GitHub Actions workflow for automatic deployment:

### Setup Requirements
1. **Configure GitHub Secrets** (see `GITHUB_ACTIONS_SETUP.md`)
   - `ORAMA_INDEX_ID` - Your Orama Cloud index ID  
   - `ORAMA_PRIVATE_API_KEY` - Your private API key

### Monitored Files
The workflow triggers when these paths change:
- `runtime/**/*.md`, `deploy/**/*.md`, `examples/**/*.md`
- `subhosting/**/*.md`, `lint/**/*.md`
- `reference_gen/**`, `deno.json`, `orama/**`

## Manual Usage

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

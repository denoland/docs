export default function CopyPage({ file }: { file: string | undefined }) {
  if (!file || file.includes("[")) return null;

  const markdownUrl = `https://docs.deno.com${file}`;
  const claudeUrl = `https://claude.ai/new?q=${
    encodeURIComponent(
      `Read this page from the Deno docs: ${markdownUrl} and answer questions about the content.`,
    )
  }`;

  return (
    <details class="copy-page-dropdown mb-4">
      <summary class="btn list-none [&::-webkit-details-marker]:hidden flex items-center gap-2 cursor-pointer select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          width="14"
          height="14"
          viewBox="0 0 16 16"
        >
          <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
          <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
        </svg>
        Copy page
        <svg
          class="copy-page-chevron ml-1 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          width="12"
          height="12"
          viewBox="0 0 16 16"
        >
          <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z" />
        </svg>
      </summary>

      <div class="mt-2 border border-foreground-tertiary rounded-md overflow-hidden bg-white dark:bg-gray-900">
        <button
          class="copy-page-link-btn flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-background-secondary dark:hover:bg-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            class="mt-0.5 shrink-0"
          >
            <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 2 2 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a2.002 2.002 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 2 2 0 0 0-2.83 0l-2.5 2.5a2.002 2.002 0 0 0 0 2.83Z" />
          </svg>
          <span>
            <span class="copy-page-link-label block text-sm font-medium">
              Copy page link
            </span>
            <span class="block text-xs text-foreground-secondary mt-0.5">
              Copy the current page URL to clipboard
            </span>
          </span>
        </button>

        <a
          href={file}
          target="_blank"
          class="flex items-start gap-3 px-4 py-3 border-t border-foreground-tertiary hover:bg-background-secondary dark:hover:bg-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            class="mt-0.5 shrink-0"
          >
            <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z" />
          </svg>
          <span>
            <span class="block text-sm font-medium">View Page as Markdown</span>
            <span class="block text-xs text-foreground-secondary mt-0.5">
              Open the Markdown file in a new tab
            </span>
          </span>
        </a>

        <a
          href={claudeUrl}
          target="_blank"
          class="flex items-start gap-3 px-4 py-3 border-t border-foreground-tertiary hover:bg-background-secondary dark:hover:bg-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            class="mt-0.5 shrink-0"
          >
            <path d="M12 0C12 0 10.5 10.5 0 12C10.5 12 12 24 12 24C12 24 13.5 13.5 24 12C13.5 12 12 0 12 0Z" />
          </svg>
          <span>
            <span class="block text-sm font-medium">Open in Claude</span>
            <span class="block text-xs text-foreground-secondary mt-0.5">
              Ask Claude about this page
            </span>
          </span>
        </a>
      </div>
    </details>
  );
}

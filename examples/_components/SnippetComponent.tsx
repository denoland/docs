import Prism from "prismjs";
import { ExampleSnippet } from "../types.ts";

export default function SnippetComponent(props: {
  filename: string;
  onlyOneSnippet: boolean;
  firstOfFile: boolean;
  lastOfFile: boolean;
  snippet: ExampleSnippet;
}) {
  const html = Prism.highlight(props.snippet.code, Prism.languages.js, "js");

  return (
    <div class="example-block flex flex-col">
      {props.snippet.text && (
        <div class="snippet-comment max-w-[70ch] mt-6 mb-3">
          {props.snippet.text}
        </div>
      )}
      {props.snippet.code && (
        <div class="relative">
          {props.filename && props.firstOfFile && (
            <span class="font-mono text-xs absolute -top-3 left-3 z-10 p-1 rounded-sm bg-foreground-tertiary">
              {props.filename}
            </span>
          )}
          <div class="-mx-4 sm:mx-0 overflow-auto relative gfm-highlight">
            <div
              data-color-mode="light"
              data-dark-theme="dark"
              data-light-theme="light"
              class="nocopy markdown-body"
            >
              <pre
                class="highlight snippet-code language-ts rounded-none"
                data-example-position={props.onlyOneSnippet
                  ? "only"
                  : props.firstOfFile
                  ? "first"
                  : props.lastOfFile
                  ? "last"
                  : "middle"}
              >
                  <code
                    dangerouslySetInnerHTML={{ __html: html }}
                  ></code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

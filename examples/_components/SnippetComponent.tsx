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
    <div class="grid grid-cols-1 sm:grid-cols-10 gap-x-8">
      <div
        class={`select-none text-sm ${
          props.snippet.text ? "pb-4 mt-4 " : " "
        } ${
          props.snippet.code
            ? "italic text-balance col-span-5 sm:col-span-3 md:pb-0"
            : "mt-4 col-span-full"
        }`}
      >
        {props.snippet.text}
      </div>
      <div
        class={`col-span-7 relative ${
          props.snippet.code.length === 0 ? "hidden sm:block" : ""
        }`}
      >
        {props.filename && (
          <span
            class={`font-mono text-xs absolute -top-3 left-4 z-10 p-1 rounded-sm ${
              props.firstOfFile ? "block" : "block sm:hidden"
            }`}
          >
            {props.filename}
          </span>
        )}
        <div class="-mx-4 h-full sm:mx-0 overflow-scroll sm:overflow-hidden relative gfm-highlight">
          {props.snippet.code && (
            <div
              data-color-mode="light"
              data-dark-theme="dark"
              data-light-theme="light"
              class="nocopy h-full markdown-body"
            >
              <pre
                class="highlight snippet-code language-ts"
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
          )}
        </div>
      </div>
    </div>
  );
}

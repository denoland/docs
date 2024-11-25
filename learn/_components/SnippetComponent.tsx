import { ExampleSnippet } from "../types.ts";

export default function SnippetComponent(props: {
    filename: string;
    firstOfFile: boolean;
    lastOfFile: boolean;
    snippet: ExampleSnippet;
  }) {
    return (
      <div class="grid grid-cols-1 sm:grid-cols-10 gap-x-8">
        <div
          class={`italic select-none text-sm ${
            props.snippet.text ? "pb-4 md:pb-0 " : " "
          } ${props.snippet.code ? "col-span-3" : "mt-4 col-span-full"}`}
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
                  data-example-position={props.firstOfFile
                    ? "first"
                    : props.lastOfFile
                    ? "last"
                    : "middle"}
                >
                  <code
                    dangerouslySetInnerHTML={{ __html: props.snippet.code }}
                  ></code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
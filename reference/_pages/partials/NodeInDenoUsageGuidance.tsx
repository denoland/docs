import { nbsp } from "../../_util/common.ts";

export function NodeInDenoUsageGuidance(
  { nodePackage }: { nodePackage: string },
) {
  if (!nodePackage) {
    return null;
  }

  return (
    <div class="usageContent px-4 pt-4 pb-5 bg-stone-100 rounded border border-gray-300">
      <h3>Usage in Deno</h3>
      <div
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body"
      >
        <div class="relative">
          <pre>
            <code class="highlight notranslate language-typescript">
            <span class="token keyword">import</span>
            {nbsp}
            <span class="token operator">*</span>
            {nbsp}
            <span class="token keyword">as</span>
            {nbsp}
             mod
             {nbsp}
             <span class="token keyword">from</span>
             {nbsp}
             <span class="token string">"node:{nodePackage}"</span>
             <span class="token punctuation">;</span>
          </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

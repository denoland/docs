import React from "npm:@preact/compat";

export function DetailedSection({ children }: { children: React.ReactNode }) {
  return (
    <div class="max-w-[75ch]">
      <div
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body"
      >
        {children}
      </div>
    </div>
  );
}

import React from "npm:@preact/compat";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <h1>Reference Docs</h1>
      </div>
      <h1></h1>
      <main>
        {children}
      </main>
    </div>
  );
}

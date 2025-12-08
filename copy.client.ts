// copy.client.ts
// Places a stable top-right copy button that stays put while code scrolls horizontally.
// Uses the compact 3-line "copy" icon and shows a check icon briefly on success.

function cleanShellPrompts(text: string) {
  return text.split(/\r?\n/).map((line) =>
    line.replace(/^\s*(?:[$>❯#%]|\u203A|>>)\s?/, "")
  ).join("\n");
}

function findScrollableAncestor(el: Element | null): Element | null {
  while (el && el !== document.documentElement) {
    const cs = window.getComputedStyle(el as Element);
    const overflowX = cs.overflowX;
    const overflow = cs.overflow;
    if (
      overflowX === "auto" || overflowX === "scroll" || overflow === "auto" ||
      overflow === "scroll"
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

function createWrapper(cleanText: string) {
  const wrapper = document.createElement("div");
  wrapper.className = "copy-wrapper";
  wrapper.setAttribute("data-copy", cleanText);

  wrapper.innerHTML = `
    <button class="copy-button" type="button" aria-label="Copy code">
      <!-- compact 3-line copy icon (preferred) -->
      <svg class="icon-copy" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="7" y="7" width="10" height="10" rx="1.5"></rect>
        <path d="M9 3H5a2 2 0 0 0-2 2v4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <svg class="icon-check" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="display:none;">
        <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
  `;
  return wrapper;
}

function hideThemePlaceholders(pre: HTMLElement) {
  const selectors = [
    ".code-actions",
    ".code-toolbar",
    ".highlight .actions",
    ".highlight .controls",
    ".code-block__actions",
    ".pre-actions",
    ".copy-area",
    ".placeholder",
  ];
  for (const sel of selectors) {
    pre.querySelectorAll(sel).forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });
  }

  // Hide any small dashed boxes heuristically inside the pre
  Array.from(pre.querySelectorAll<HTMLElement>("div,span")).forEach((el) => {
    const cs = window.getComputedStyle(el);
    if (
      (cs.borderStyle && cs.borderStyle.includes("dashed")) ||
      (cs.border && cs.border.includes("dashed"))
    ) {
      el.style.display = "none";
    }
  });
}

function attachButtons() {
  document.querySelectorAll("pre > code").forEach((code) => {
    const pre = code.parentElement as HTMLElement | null;
    if (!pre) return;
    if (pre.querySelector(".copy-wrapper")) return; // already attached

    const raw = code.textContent ?? "";
    if (!raw.trim()) return;
    const cleaned = cleanShellPrompts(raw);

    // Create wrapper
    const wrapper = createWrapper(cleaned);

    // Find nearest scrollable ancestor
    const scrollAncestor = findScrollableAncestor(pre);
    // We want to attach to a container that is NOT the scrollable element.
    // If the scrollable ancestor is the `pre` itself (common), attach to pre.parentElement instead.
    let attachTarget: HTMLElement | null = null;
    if (
      scrollAncestor && scrollAncestor !== pre &&
      scrollAncestor instanceof HTMLElement
    ) {
      // Found some scrolling ancestor above pre -> attach to that ancestor
      attachTarget = scrollAncestor as HTMLElement;
    } else {
      // fallback: attach to the pre's parent (wrapper element outside scroll area)
      attachTarget = pre.parentElement ?? pre;
    }

    // Ensure attachTarget is positioning context
    const cs = window.getComputedStyle(attachTarget);
    if (cs.position === "static") {
      attachTarget.style.position = "relative";
    }

    // Ensure code has enough right padding so that content doesn't sit under the button
    const codeEl = code as HTMLElement;
    const currentPRight =
      parseFloat(window.getComputedStyle(codeEl).paddingRight || "0") || 0;
    if (currentPRight < 56) {
      codeEl.style.paddingRight = "56px";
    }

    // Hide theme placeholders inside pre so our button is the only control visible
    hideThemePlaceholders(pre);

    // Append wrapper to the chosen attachTarget
    attachTarget.appendChild(wrapper);
  });
}

// Delegate click handling (single listener)
document.addEventListener("click", (e) => {
  const wrapper = (e.target as HTMLElement).closest(".copy-wrapper") as
    | HTMLElement
    | null;
  if (!wrapper) return;

  const raw = wrapper.getAttribute("data-copy") || "";
  const cleaned = cleanShellPrompts(raw);

  (async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleaned);
      } else {
        const ta = document.createElement("textarea");
        ta.value = cleaned;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
    } catch (err) {
      console.error("Copy failed", err);
      return;
    }

    const copyIcon = wrapper.querySelector<HTMLElement>(".icon-copy");
    const checkIcon = wrapper.querySelector<HTMLElement>(".icon-check");
    if (copyIcon && checkIcon) {
      copyIcon.style.display = "none";
      checkIcon.style.display = "inline-block";
      setTimeout(() => {
        checkIcon.style.display = "none";
        copyIcon.style.display = "inline-block";
      }, 1400);
    }
  })();
});

document.addEventListener("DOMContentLoaded", () => {
  attachButtons();
  // expose for SPA or debug
  (window as any).attachDocCopyButtons = attachButtons;
});

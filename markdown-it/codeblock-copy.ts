// deno-lint-ignore-file no-explicit-any

export default function codeblockCopyPlugin(md: any) {
  const defaultRender = md.renderer.rules.fence;

  md.renderer.rules.fence = function (
    tokens: any[],
    idx: number,
    options: any,
    env: any,
    self: any,
  ) {
    const render = defaultRender(tokens, idx, options, env, self);
    const uniqueId = `copy-button-${idx}`;
    const content = tokens[idx].content.replaceAll('"', "&quot;").replaceAll(
      "'",
      "&apos;",
    );

    const buttonHtml = `
      <button id="${uniqueId}" class="copyButton" data-copy="${content}" title="Copy">
        <svg class="copy-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="7" height="7" fill="none"/>
          <rect x="6" y="6" width="7" height="7" fill="none"/>
          <path d="M1.55566 2.7C1.55566 2.03726 2.09292 1.5 2.75566 1.5H8.75566C9.41841 1.5 9.95566 2.03726 9.95566 2.7V5.1H12.3557C13.0184 5.1 13.5557 5.63726 13.5557 6.3V12.3C13.5557 12.9627 13.0184 13.5 12.3557 13.5H6.35566C5.69292 13.5 5.15566 12.9627 5.15566 12.3V9.9H2.75566C2.09292 9.9 1.55566 9.36274 1.55566 8.7V2.7ZM6.35566 9.9V12.3H12.3557V6.3H9.95566V8.7C9.95566 9.36274 9.41841 9.9 8.75566 9.9H6.35566ZM8.75566 8.7V2.7H2.75566V8.7H8.75566Z" fill="hsla(var(--foreground-secondary))"/>
        </svg>
        <svg class="check-icon hidden" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7.5L6.5 11L12 3" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;

    const script = `
      <script>
        (function() {
          const button = document.getElementById('${uniqueId}');
          button.addEventListener('click', function() {
            let textToCopy = this.getAttribute('data-copy');
            // CLEAN COMMANDS:  Remove leading spaces, $, and > from each line
            textToCopy = textToCopy.replace(/^[\$>\s]+/, '');

            navigator.clipboard.writeText(textToCopy).then(() => {
              this.querySelector('.copy-icon').classList.add('hidden');
              this.querySelector('.check-icon').classList.remove('hidden');
              setTimeout(() => {
                this.querySelector('.copy-icon').classList.remove('hidden');
                this.querySelector('.check-icon').classList.add('hidden');
              }, 2000);
            });
          });
        })();
      </script>
    `;

    return `<div class="relative">${render}${buttonHtml}${script}</div>`;
  };
}

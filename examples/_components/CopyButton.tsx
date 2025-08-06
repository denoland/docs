export function CopyButton(props: { text: string }) {
  return (
    <button
      type="button"
      aria-label="Copy code to clipboard"
      title="Copy"
      class="absolute right-2 top-2 transition-colors duration-150 hover:bg-gray-200 text-gray-900 p-2 rounded-md z-10"
      data-copy={props.text}
    >
      <svg class="copy-icon" viewBox="0 0 24 24" width="15" height="15">
        <path
          fill="currentColor"
          d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
        >
        </path>
      </svg>
      <svg
        class="check-icon hidden"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 7.5L6.5 11L12 3"
          stroke="green"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  );
}

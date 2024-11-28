export function VideoIcon(props: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 445 348"
      className="inline mr-2"
      width="1rem"
    >
      <rect
        x="15"
        y="15"
        width="415.3"
        height="318"
        rx="56.7"
        ry="56.7"
        fill="none"
        stroke={props.color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="30"
      />
      <path
        fill="none"
        stroke={props.color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="30"
        d="M15 95h415M67 18l74 75m165-78 72 73M228 15l70 70M145 15l77 77m-31 165v-92l98 46-98 46z"
      />
    </svg>
  );
}

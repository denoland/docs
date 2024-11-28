export function ExampleIcon(props: { color: string }) {
  return (
    <svg
      className="inline mr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 328 258"
      width="1rem"
    >
      <path
        d="m86 58-71 70 71 72M186 15l-46 228M242 59l71 71-71 72"
        fill="none"
        stroke={props.color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="30"
      />
    </svg>
  );
}

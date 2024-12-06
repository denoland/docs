export default function SidebarTopNav(props: { name: string; url: string }) {
  return (
    <li class="mx-2">
      <a
        class="block px-3 py-1.5 text-[.8125rem] leading-4 font-normal text-foreground-secondary rounded-md ring-1 ring-transparent hover:ring-background-tertiary hover:bg-background-secondary current:bg-background-secondary current:text-blue-500 current:font-semibold transition-colors duration-200 ease-in-out select-none"
        href={props.url}
      >
        {props.name}
      </a>
    </li>
  );
}

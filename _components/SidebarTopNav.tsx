export default function SidebarTopNav(props: { name: string; url: string }) {
  return (
    <li>
      <a href={props.url}>
        <h2 class="border-b border-foreground-tertiary pt-2 pb-1.5 -mx-5 px-8 mt-4 mb-2 text-sm font-semibold hover:bg-background-secondary current:bg-background-secondary current:text-blue-500 text-foreground-primary capitalize">
          {props.name}
        </h2>
      </a>
    </li>
  );
}

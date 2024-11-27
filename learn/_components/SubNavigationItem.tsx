export function SubNavigationItem(props: { page: string; active: string }) {
  const active = props.active === props.page ? "active" : "";
  const url = props.page.includes("learn")
    ? `/${props.page}/`
    : `/learn/${props.page}/`;
  return (
    <a
      className={`block hover:underline mx-1 px-2 relative capitalize ${active}`}
      href={url}
    >
      {props.page}
    </a>
  );
}

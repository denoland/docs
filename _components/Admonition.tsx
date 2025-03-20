type AdmonitionType =
  | "note"
  | "caution"
  | "warning"
  | "tip"
  | "danger"
  | "info"
  | "success"
  | "error";

export default function Admonition(
  props: { type: AdmonitionType; children: any },
) {
  return (
    <div class={`admonition ${props.type}`}>
      <div class="title">{props.type}</div>
      <p></p>
      {/* This is how lume seems to add a space between the title and the content (sorry for the hacky solution)*/}
      {props.children}
    </div>
  );
}

import { DocNodeKind } from "@deno/doc/types";

export function CodeIcon({ glyph }: { glyph: DocNodeKind }) {
  let classStyle = "";
  switch (glyph) {
    case "class":
      classStyle = "text-Class bg-Class/15";
      break;
    case "function":
      classStyle = "text-Function bg-Function/15";
      break;
    case "interface":
      classStyle = "text-Interface bg-Interface/15";
      break;
    case "typeAlias":
      classStyle = "text-TypeAlias bg-TypeAlias/15";
      break;
  }

  let title = "";
  switch (glyph) {
    case "class":
      title = "c";
      break;
    case "function":
      title = "f";
      break;
    case "interface":
      title = "I";
      break;
    case "typeAlias":
      title = "T";
      break;
  }

  if (classStyle === "") {
    return <></>;
  }

  return (
    <div class="docNodeKindIcon">
      <div class={classStyle} title={glyph}>{title}</div>
    </div>
  );
}

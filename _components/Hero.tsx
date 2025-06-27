import { ComponentChildren } from "npm:preact";

export default function (props: { children: ComponentChildren }) {
  return (
    <div className="hero">
      {props.children}
    </div>
  );
}

export const css = "@import './_components/Hero.css';";

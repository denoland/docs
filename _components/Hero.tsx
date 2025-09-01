import { ComponentChildren } from "npm:preact";

export default function (props: { children: ComponentChildren }) {
  return (
    <div
      className="w-full grid grid-cols-1 gap-4 items-center md:grid-cols-[minmax(0,1fr)_16rem]
      md:[&_img]:order-2 lg:grid-cols-[minmax(0,1fr)_24rem]"
      data-component="hero"
    >
      {props.children}
    </div>
  );
}

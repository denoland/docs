import React from "npm:@preact/compat";
import { AnchorableHeading } from "./AnchorableHeading.tsx";

export function MemberSection(
  { title, children, id }: {
    title: string;
    children: React.ReactNode;
    id?: string;
  },
) {
  return (
    <div id={id}>
      <div className={"space-y-7"}>
        <section className={"section"}>
          <AnchorableHeading anchor={title}>
            {title}
          </AnchorableHeading>
        </section>
      </div>

      <div className={"space-y-7"}>
        {children}
      </div>
    </div>
  );
}

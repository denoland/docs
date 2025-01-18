import { ClassConstructorDef, DocNode } from "@deno/doc/types";
import {
  ClosureContent,
  hasJsDoc,
  ValidMethodType,
  ValidPropertyWithOptionalJsDoc,
} from "../../types.ts";
import { MethodSignature } from "../primitives/MethodSignature.tsx";
import { MemberSection } from "./MemberSection.tsx";
import { PropertyItem } from "./PropertyItem.tsx";
import { DetailedSection } from "./DetailedSection.tsx";
import { MarkdownContent } from "../primitives/MarkdownContent.tsx";
import { JsDocDescription } from "./JsDocDescription.tsx";
import {
  TableOfContents,
  TocListItem,
  TocSection,
} from "./TableOfContents.tsx";

export function getSymbolDetails(data: DocNode) {
  const members = getMembers(data);

  const details = [
    <JsDocDescription jsDoc={data.jsDoc} />,
    <Constructors data={members.constructors} />,
    <Properties properties={members.properties} />,
    <Methods methods={members.methods} />,
  ];

  if (members.kind === "class") {
    details.pop();
    details.push(
      <Methods methods={members.instanceMethods || []} />,
      <Methods
        methods={members.staticMethods || []}
        label={"Static Methods"}
      />,
    );
  }

  const contents = [
    <ul>
      <TocSection title="Constructors">
        {members.constructors.map((prop) => {
          return <TocListItem item={prop} type="constructor" />;
        })}
      </TocSection>
    </ul>,
    <ul>
      <TocSection title="Properties">
        {members.properties.map((prop) => {
          return <TocListItem item={prop} type="property" />;
        })}
      </TocSection>
    </ul>,
    <ul>
      <TocSection title="Method">
        {members.methods.map((prop) => {
          return <TocListItem item={prop} type="method" />;
        })}
      </TocSection>
    </ul>,
  ];

  return { details, contents: <TableOfContents>{contents}</TableOfContents> };
}

function getMembers(x: DocNode): ClosureContent {
  if (x.kind === "class" && x.classDef) {
    return {
      kind: "class",
      constructors: x.classDef.constructors,
      methods: x.classDef.methods,
      properties: x.classDef.properties as ValidPropertyWithOptionalJsDoc[],
      callSignatures: [],
      indexSignatures: x.classDef.indexSignatures,
      instanceMethods: x.classDef.methods.filter((method) => !method.isStatic),
      staticMethods: x.classDef.methods.filter((method) => method.isStatic),
    };
  }

  if (x.kind === "interface" && x.interfaceDef) {
    return {
      kind: "interface",
      constructors: [],
      methods: x.interfaceDef.methods,
      properties: x.interfaceDef.properties as ValidPropertyWithOptionalJsDoc[],
      callSignatures: x.interfaceDef.callSignatures,
      indexSignatures: x.interfaceDef.indexSignatures,
    };
  }

  if (x.kind === "variable") {
    if (x.variableDef?.tsType?.kind === "typeLiteral") {
      return {
        kind: "typeLiteral",
        constructors: [],
        methods: x.variableDef.tsType.typeLiteral.methods,
        properties: x.variableDef.tsType.typeLiteral.properties,
        callSignatures: x.variableDef.tsType.typeLiteral.callSignatures,
        indexSignatures: x.variableDef.tsType.typeLiteral.indexSignatures,
      };
    } else {
      return {
        kind: "variable",
        constructors: [],
        methods: [],
        properties: [],
        callSignatures: [],
        indexSignatures: [],
      };
    }
  }

  throw new Error(`Unexpected kind: ${x.kind}`);
}

function Methods(
  { methods, label = "Methods" }: {
    methods: ValidMethodType[];
    label?: string;
  },
) {
  if (methods.length === 0) {
    return <></>;
  }

  return (
    <MemberSection title={label}>
      {methods.map((method) => {
        return <MethodSummary method={method} />;
      })}
    </MemberSection>
  );
}

function MethodSummary({ method }: { method: ValidMethodType }) {
  const detailedSection = hasJsDoc(method)
    ? (
      <DetailedSection>
        <MarkdownContent text={method.jsDoc.doc} />
      </DetailedSection>
    )
    : null;

  return (
    <div>
      <div>
        <MethodSignature method={method} />
      </div>
      {detailedSection}
    </div>
  );
}

function Properties(
  { properties }: { properties: ValidPropertyWithOptionalJsDoc[] },
) {
  if (properties.length === 0) {
    return <></>;
  }

  return (
    <MemberSection title="Properties">
      {properties.map((prop) => <PropertyItem property={prop} />)}
    </MemberSection>
  );
}

function Constructors({ data }: { data: ClassConstructorDef[] }) {
  if (data.length === 0) {
    return <></>;
  }

  return (
    <MemberSection title="Constructors">
      <div>The details of the constrcutors should be populated here.</div>
    </MemberSection>
  );
}

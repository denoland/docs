import { ClassConstructorDef, DocNode } from "@deno/doc/types";
import {
  ClosureContent,
  hasJsDoc,
  SymbolDoc,
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

export function getSymbolDetails(data: SymbolDoc<DocNode>) {
  const members = getMembers(data);

  const details = [
    <JsDocDescription jsDoc={data.data.jsDoc} />,
    <Constructors data={members.constructors} />,
    <Properties properties={members.properties} />,
    <Methods parent={data} methods={members.methods} />,
  ];

  if (members.kind === "class") {
    details.pop();
    details.push(
      <Methods parent={data} methods={members.instanceMethods || []} />,
      <Methods
        parent={data}
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

  return { details, toc: <TableOfContents>{contents}</TableOfContents> };
}

function getMembers(x: SymbolDoc<DocNode>): ClosureContent {
  if (x.data.kind === "class" && x.data.classDef) {
    return {
      kind: "class",
      constructors: x.data.classDef.constructors,
      methods: x.data.classDef.methods,
      properties: x.data.classDef
        .properties as ValidPropertyWithOptionalJsDoc[],
      callSignatures: [],
      indexSignatures: x.data.classDef.indexSignatures,
      instanceMethods: x.data.classDef.methods.filter((method) =>
        !method.isStatic
      ),
      staticMethods: x.data.classDef.methods.filter((method) =>
        method.isStatic
      ),
    };
  }

  if (x.data.kind === "interface" && x.data.interfaceDef) {
    return {
      kind: "interface",
      constructors: [],
      methods: x.data.interfaceDef.methods,
      properties: x.data.interfaceDef
        .properties as ValidPropertyWithOptionalJsDoc[],
      callSignatures: x.data.interfaceDef.callSignatures,
      indexSignatures: x.data.interfaceDef.indexSignatures,
    };
  }

  if (x.data.kind === "variable") {
    if (x.data.variableDef?.tsType?.kind === "typeLiteral") {
      return {
        kind: "typeLiteral",
        constructors: [],
        methods: x.data.variableDef.tsType.typeLiteral.methods,
        properties: x.data.variableDef.tsType.typeLiteral.properties,
        callSignatures: x.data.variableDef.tsType.typeLiteral.callSignatures,
        indexSignatures: x.data.variableDef.tsType.typeLiteral.indexSignatures,
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

  throw new Error(`Unexpected kind: ${x.data.kind}`);
}

function Methods(
  { parent, methods, label = "Methods" }: {
    parent: SymbolDoc<DocNode>;
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
        return <MethodSummary parent={parent} method={method} />;
      })}
    </MemberSection>
  );
}

function MethodSummary(
  { parent, method }: { parent: SymbolDoc<DocNode>; method: ValidMethodType },
) {
  const detailedSection = hasJsDoc(method)
    ? (
      <DetailedSection>
        <MarkdownContent text={method.jsDoc.doc} />
      </DetailedSection>
    )
    : null;

  const link = `${parent.identifier}.prototype.${method.name}`;

  return (
    <div>
      <div>
        <a href={link}>
          <MethodSignature method={method} />
        </a>
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

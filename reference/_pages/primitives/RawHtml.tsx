export function RawHtml({ rendered }: { rendered: string }) {
  return <div dangerouslySetInnerHTML={{ __html: rendered }}></div>;
}

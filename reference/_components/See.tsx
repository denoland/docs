export default function ({ sees }: { sees: string[] }) {
  return (
    <ul class="see">
      {/*markdown rendering*/}
      {sees.map((see) => <li dangerouslySetInnerHTML={{ __html: see }}></li>)}
    </ul>
  );
}

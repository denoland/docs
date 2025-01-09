export function LinkCode({ symbol }: { symbol: string }) {
  const target = "~/" + symbol;

  return (
    <a href={target}>
      <code>{symbol}</code>
    </a>
  );
}

export function insertLinkCodes(text: string) {
  // replace each text occurance of {@linkcode foo} with <LinkCode symbol="foo" />
  const tokens = text.split(/(\{@linkcode [^\}]+\})/);
  const firstLineOfJsDocWithLinks = tokens.map((token, index) => {
    if (token.startsWith("{@linkcode ")) {
      const symbol = token.slice(11, -1);
      return <LinkCode symbol={symbol} key={index} />;
    }
    return token;
  });

  const merge = firstLineOfJsDocWithLinks.reduce(
    // deno-lint-ignore no-explicit-any
    (acc: any, curr: any) => {
      return acc === null ? [curr] : [...acc, " ", curr];
    },
    null,
  );

  return merge;
}

export function linkCodeAndParagraph(text: string) {
  // deno-lint-ignore no-explicit-any
  // const withLinks: any = insertLinkCodes(text);

  // for (const index in withLinks) {
  //   const current = withLinks[index];

  //   if (
  //     typeof current === "string" && current.includes("\n\n")
  //   ) {
  //     const withBreaks = current.split("\n\n").map((line: string) => {
  //       return (
  //         <>
  //           {line}
  //           <br />
  //           <br />
  //         </>
  //       );
  //     });

  //     withLinks.splice(index, 1, withBreaks);
  //   }
  // }

  // TODO: fixme
  return insertLinkCodes(text);
}

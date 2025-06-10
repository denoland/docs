export default function OpenGraph(
  { title, description, section, url }: {
    title: string;
    description: string;
    section: string;
    url: string;
  },
) {
  const formatHtmlForMeta = (html: string): string => {
    // Convert <sup> content to Unicode superscript characters
    let formatted = html.replace(/<sup>(\d+)<\/sup>/g, (_, digit) => {
      const superscriptMap: Record<string, string> = {
        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹",
      };
      return digit.split("").map((char: any) => superscriptMap[char] || char)
        .join(
          "",
        );
    });

    formatted = formatted.replace(/<sup>([a-zA-Z]+)<\/sup>/g, (_, text) => {
      const superscriptAlphaMap: Record<string, string> = {
        "a": "ᵃ",
        "b": "ᵇ",
        "c": "ᶜ",
        "d": "ᵈ",
        "e": "ᵉ",
        "f": "ᶠ",
        "g": "ᵍ",
        "h": "ʰ",
        "i": "ⁱ",
        "j": "ʲ",
        "k": "ᵏ",
        "l": "ˡ",
        "m": "ᵐ",
        "n": "ⁿ",
        "o": "ᵒ",
        "p": "ᵖ",
        "q": "ᵠ",
        "r": "ʳ",
        "s": "ˢ",
        "t": "ᵗ",
        "u": "ᵘ",
        "v": "ᵛ",
        "w": "ʷ",
        "x": "ˣ",
        "y": "ʸ",
        "z": "ᶻ",
        "A": "ᴬ",
        "B": "ᴮ",
        "C": "ᶜ",
        "D": "ᴰ",
        "E": "ᴱ",
        "F": "ᶠ",
        "G": "ᴳ",
        "H": "ᴴ",
        "I": "ᴵ",
        "J": "ᴶ",
        "K": "ᴷ",
        "L": "ᴸ",
        "M": "ᴹ",
        "N": "ᴺ",
        "O": "ᴼ",
        "P": "ᴾ",
        "Q": "ꟴ",
        "R": "ᴿ",
        "S": "ˢ",
        "T": "ᵀ",
        "U": "ᵁ",
        "V": "ⱽ",
        "W": "ᵂ",
        "X": "ˣ",
        "Y": "ʸ",
        "Z": "ᶻ",
      };
      return text.split("").map((char: any) =>
        superscriptAlphaMap[char] || char
      )
        .join("");
    });

    formatted = formatted.replace(/<sup>([^<]*)<\/sup>/g, "⁽$1⁾");

    return formatted.replace(/<[^>]*>/g, "");
  };

  let image;
  if (section == "api") {
    image = `/img/og.webp`;
  } else {
    image = `${url}index.png`;
  }

  // Process both title and description
  const formattedTitle = formatHtmlForMeta(title);
  const formattedDescription = formatHtmlForMeta(description);

  return (
    <>
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={formattedDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={formattedDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@deno_land" />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={formattedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={formattedDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Deno" />
      <meta property="og:locale" content="en_US" />
    </>
  );
}

/**
 * @title Split text by words, sentences, and graphemes
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter} MDN: Intl.Segmenter
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/segment} MDN: segment
 * @group Web Standard APIs
 *
 * Splitting text with split or slice breaks on punctuation, emoji, and
 * languages that do not use spaces. Intl.Segmenter understands locale
 * rules and can split by word, sentence, or grapheme, which is what a
 * human perceives as one character. This example shows all three
 * granularities and a truncation helper that never cuts an emoji in
 * half.
 */

// Word segmentation yields words and the separators between them. The
// isWordLike flag filters out spaces and punctuation.
const wordSegmenter = new Intl.Segmenter("en", { granularity: "word" });
const text = "Deno ships with web standard APIs. Try Intl.Segmenter!";
const words = [...wordSegmenter.segment(text)]
  .filter((segment) => segment.isWordLike)
  .map((segment) => segment.segment);
console.log(words.join("|")); // Deno|ships|with|web|standard|APIs|Try|Intl|Segmenter
console.log(words.length); // 9

// Word segmentation also works for languages without spaces, where
// split(" ") would return the whole sentence as one chunk.
const japaneseSegmenter = new Intl.Segmenter("ja", { granularity: "word" });
const japaneseWords = [...japaneseSegmenter.segment("デノは安全です")]
  .filter((segment) => segment.isWordLike)
  .map((segment) => segment.segment);
console.log(japaneseWords.join("|")); // デ|ノ|は|安全|です

// Sentence segmentation splits prose into sentences, keeping trailing
// spaces attached.
const sentenceSegmenter = new Intl.Segmenter("en", {
  granularity: "sentence",
});
const prose = "Deno is secure by default. It needs permission flags. Try it!";
const sentences = [...sentenceSegmenter.segment(prose)]
  .map((segment) => segment.segment.trim());
console.log(sentences.length); // 3
console.log(sentences[1]); // It needs permission flags.

// String length counts UTF-16 code units, not characters. A family emoji
// is several emoji joined invisibly, so length and even the spread
// operator report surprising numbers.
const family = "👨‍👩‍👧‍👦";
console.log(family.length); // 11
console.log([...family].length); // 7

// Grapheme segmentation counts what a reader sees, one character.
const graphemeSegmenter = new Intl.Segmenter("en", {
  granularity: "grapheme",
});
console.log([...graphemeSegmenter.segment(family)].length); // 1

// Slicing by index can land inside an emoji. Here slice keeps the wave
// but cuts off its skin tone modifier.
const greeting = "Hi 👋🏽! Welcome 👨‍👩‍👧‍👦";
console.log(greeting.slice(0, 5)); // Hi 👋

// A safe truncation helper slices whole graphemes instead of indexes.
function truncate(input: string, maxGraphemes: number): string {
  const graphemes = [...graphemeSegmenter.segment(input)];
  if (graphemes.length <= maxGraphemes) {
    return input;
  }
  const kept = graphemes.slice(0, maxGraphemes);
  return kept.map((segment) => segment.segment).join("") + "…";
}

console.log(truncate(greeting, 5)); // Hi 👋🏽!…
console.log(truncate("short", 80)); // short

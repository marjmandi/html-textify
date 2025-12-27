/**
 * Wraps text into lines containing a fixed number of words.
 *
 * @param {string} text - The input text to wrap.
 * @param {number} count - Maximum number of words per line. Must be greater than 0.
 * @returns {string} The wrapped text, with lines separated by newline characters.
 *
 * @example
 * wrapByWords("one two three four five", 2);
 * // => "one two\nthree four\nfive"
 */
export function wrapByWords(text: string, count: number): string {
  if (count <= 0) {
    throw new Error('wrap count must be greater than 0');
  }
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];

  for (let i = 0; i < words.length; i += count) {
    lines.push(words.slice(i, i + count).join(' '));
  }

  return lines.join('\n');
}

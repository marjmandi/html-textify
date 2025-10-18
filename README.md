# html-textify

Convert HTML into plain text while optionally preserving formatting and keeping specific tags intact. Perfect for emails, logs, or text-only outputs.

---

## Features

- Convert HTML to plain text
- Preserve formatting such as paragraphs, headings, lists, bold, italic, links, blockquotes, and tables
- Optionally ignore specific tags to keep them in the output
- Wrap output by word count or character length
- Handles self-closing tags and nested content
- Strips unknown tags and decodes common HTML entities (`&nbsp;`, `&amp;`, `&lt;`, `&gt;`)

## Installation

```bash
pnpm add html-textify
# or
npm install html-textify
# or
yarn add html-textify
```

## Usage

```ts
import { textify } from 'html-textify';

// Simple usage
const html = '<p>Hello <b>World</b></p>';
const plain = textify({ html });
console.log(plain); // "Hello **World**"

// Preserve formatting but ignore certain tags
const html2 = '<p>Paragraph <b>bold</b> <i>italic</i></p>';
const result = textify({
  html: html2,
  preserveFormatting: true,
  ignoreTags: ['b', 'i'],
});
console.log(result); // "Paragraph <b>bold</b><i>italic</i>"

// Strip all tags except ignored ones
const html3 = '<p>Paragraph <mark>highlighted</mark></p>';
const stripped = textify({
  html: html3,
  preserveFormatting: false,
  ignoreTags: ['mark'],
});
console.log(stripped); // "Paragraph <mark>highlighted</mark>"

// Wrap by words (max 2 words per line)
const html4 = '<p>one two three four five</p>';
const wrappedWords = textify({
  html: html4,
  preserveFormatting: false,
  wrapWords: 2,
});
console.log(wrappedWords);
/* Output:
one two
three four
five
*/

// Wrap by characters (max 10 characters per line)
const html5 = '<p>This is a test sentence for wrapping.</p>';
const wrappedChars = textify({
  html: html5,
  preserveFormatting: false,
  wrapLength: 10,
});
console.log(wrappedChars);
/* Output:
This is a
test
sentence
for
wrapping.
*/
```

## API

`textify(options: TextifyOptions): string`

- `options.html (string)` – HTML string to convert
- `options.preserveFormatting (boolean, default: true)` – Whether to keep formatting like lists, headings, blockquotes, bold/italic
- `options.ignoreTags (string[], optional)` – Tags to keep intact in output (e.g., ["b", "mark"])
- `options.wrapWords (number, optional)` – Maximum words per line (takes priority over wrapLength)
- `options.wrapLength (number, optional)` – Maximum characters per line

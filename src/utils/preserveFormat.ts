interface PreserveFormatOptions {
  html: string;
  ignoreTags?: string[];
}

/**
 * Converts HTML to a more readable plain-text format while optionally preserving certain tags.
 * - Converts headings and paragraphs to double newlines.
 * - Converts `<br>` to newline.
 * - Wraps bold (`<b>`, `<strong>`) in `**`.
 * - Wraps italic (`<i>`, `<em>`) in `*`.
 * - Converts links `<a href="...">text</a>` to `text (url)`.
 * - Formats lists (`<ol>`, `<ul>`) and list items.
 * - Formats blockquotes (`<blockquote>`) with `> ` prefix.
 * - Converts tables to tab-delimited rows.
 * - Decodes common HTML entities.
 * - Collapses multiple newlines to a maximum of two.
 *
 * @param {Object} options - Options for preserving format.
 * @param {string} options.html - The input HTML string to format.
 * @param {string[]} [options.ignoreTags] - List of tags to leave intact (default: `[]`).
 * @returns {string} The formatted plain-text representation of the HTML.
 *
 * @example
 * preserveFormat({ html: '<p>Hello <b>world</b></p>' });
 * // => 'Hello **world**'
 *
 * @example
 * preserveFormat({ html: '<ul><li>One</li><li>Two</li></ul>' });
 * // => '- One\n- Two'
 *
 * @example
 * preserveFormat({ html: '<a href="https://example.com">Link</a>', ignoreTags: ['a'] });
 * // => '<a href="https://example.com">Link</a>'
 */
export function preserveFormat({
  html,
  ignoreTags = [],
}: PreserveFormatOptions): string {
  if (!html) return '';

  // Normalize spaces between tags
  html = html.replace(/>\s+</g, '><');

  // Convert <br> to newline
  html = !ignoreTags.includes('br') ? html.replace(/<br\s*\/?>/gi, '\n') : html;

  // Headings and paragraphs -> double newline
  html = html.replace(/<\/(h[1-6]|p)>/gi, (match, tag) =>
    ignoreTags.includes(tag.toLowerCase()) ? match : '\n\n'
  );

  // Bold
  html = html.replace(
    /<(b|strong)>(.*?)<\/\1>/gi,
    (match, tag, content: string) =>
      ignoreTags.includes(tag.toLowerCase()) ? match : `**${content}**`
  );

  // Italic
  html = html.replace(/<(i|em)>(.*?)<\/\1>/gi, (match, tag, content: string) =>
    ignoreTags.includes(tag.toLowerCase()) ? match : `*${content}*`
  );

  // Links
  html = !ignoreTags.includes('a')
    ? html.replace(
        /<a\s+href="(.*?)".*?>(.*?)<\/a>/gi,
        (_m, href: string, text: string) => `[${text}](${href})`
      )
    : html;

  // Ordered lists
  html = html.replace(/<ol>(.*?)<\/ol>/gis, (match, content: string) => {
    if (ignoreTags.includes('ol')) return match; // leave <ol> as-is
    let counter = 0;
    return content.replace(/<li>(.*?)<\/li>/gi, (liMatch, liContent: string) =>
      ignoreTags.includes('li') ? liMatch : `${++counter}. ${liContent}\n`
    );
  });

  // Unordered lists
  html = html.replace(/<ul>(.*?)<\/ul>/gis, (match, content: string) => {
    if (ignoreTags.includes('ul')) return match; // keep whole <ul> block
    return content.replace(/<li>(.*?)<\/li>/gi, (liMatch, liContent: string) =>
      ignoreTags.includes('li') ? liMatch : `- ${liContent}\n`
    );
  });

  // Blockquotes
  html = !ignoreTags.includes('blockquote')
    ? html.replace(
        /<blockquote>(.*?)<\/blockquote>/gis,
        (_m, content: string) =>
          content
            .replace(/<br\s*\/?>/gi, '\n')
            .trim()
            .split('\n')
            .map((line) => `> ${line.trim()}`)
            .join('\n')
      )
    : html;

  // Tables
  html = html.replace(
    /<table>(.*?)<\/table>/gis,
    (match, tableContent: string) => {
      if (ignoreTags.includes('table')) return match; // keep whole table
      return tableContent
        .replace(/<tr>(.*?)<\/tr>/gi, (trMatch, rowContent: string) => {
          if (ignoreTags.includes('tr')) return trMatch;
          return (
            rowContent
              .replace(
                /<t[dh]>(.*?)<\/t[dh]>/gi,
                (cellMatch, cellContent: string) =>
                  ignoreTags.includes('td') || ignoreTags.includes('th')
                    ? cellMatch
                    : `${cellContent}\t`
              )
              .trim()
              .replace(/\t$/, '') + '\n'
          );
        })
        .trim();
    }
  );

  // Remove all remaining tags
  if (ignoreTags.length === 0) {
    html = html.replace(/<[^>]+>/g, '');
  } else {
    html = html.replace(/<\/?([a-z0-9]+)[^>]*>/gi, (match, tag: string) =>
      ignoreTags.includes(tag.toLowerCase()) ? match : ''
    );
  }

  // Decode common HTML entities
  html = html
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');

  // Collapse multiple newlines to max two
  html = html.replace(/\n{3,}/g, '\n\n').trim();

  return html;
}

const NON_CONTENT_TAGS = ['script', 'style', 'head', 'template', 'noscript'];

/**
 * Removes elements whose text content should never appear in plain-text
 * output — `<script>`, `<style>`, `<head>`, `<template>`, `<noscript>` —
 * including everything between their opening and closing tags.
 *
 * Tags listed in `ignoreTags` are left intact, contents included.
 *
 * An unclosed non-content tag swallows everything to the end of the input,
 * matching how browsers treat e.g. an unterminated `<script>`.
 *
 * @param {string} html - The input HTML string.
 * @param {string[]} [ignoreTags] - List of tags to leave intact (default: `[]`).
 * @returns {string} The HTML with non-content elements removed.
 *
 * @example
 * stripNonContent('<script>var a = 1;</script><p>Hi</p>');
 * // => '<p>Hi</p>'
 *
 * @example
 * stripNonContent('<style>.a{}</style>', ['style']);
 * // => '<style>.a{}</style>'
 */
export function stripNonContent(
  html: string,
  ignoreTags: string[] = []
): string {
  if (!html) return '';

  const ignored = new Set(ignoreTags.map((tag) => tag.toLowerCase()));
  const tags = NON_CONTENT_TAGS.filter((tag) => !ignored.has(tag));
  if (tags.length === 0) return html;

  // Tag name must be followed by whitespace, "/" or ">" so that e.g.
  // <style-x> is not mistaken for <style>
  const blockPattern = new RegExp(
    `<(${tags.join('|')})(?=[\\s/>])[^>]*>[\\s\\S]*?</\\1\\s*>`,
    'gi'
  );
  const unclosedPattern = new RegExp(
    `<(${tags.join('|')})(?=[\\s/>])[^>]*>[\\s\\S]*$`,
    'i'
  );

  return html.replace(blockPattern, '').replace(unclosedPattern, '');
}

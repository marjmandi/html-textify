import { preserveFormat } from './preserveFormat';

describe('preserveFormat', () => {
  it('should return empty string for empty input', () => {
    expect(preserveFormat({ html: '' })).toBe('');
  });

  it('should handle line breaks and paragraphs', () => {
    const html = '<p>First paragraph</p><br>Second line';
    const expected = 'First paragraph\n\nSecond line';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should handle headings', () => {
    const html = '<h1>Heading 1</h1><h2>Heading 2</h2><div>padding</div>';
    const expected = 'Heading 1\n\nHeading 2\n\npadding';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should handle unordered lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul><div>padding</div>';
    const expected = '- Item 1\n- Item 2\npadding';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should handle ordered lists', () => {
    const html = '<ol><li>First</li><li>Second</li></ol><div>padding</div>';
    const expected = '1. First\n2. Second\npadding';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should handle links', () => {
    const html = '<a href="https://example.com">Click here</a>';
    const expected = '[Click here](https://example.com)';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should handle bold and italic', () => {
    const html = '<b>Bold</b> and <i>Italic</i>';
    const expected = '**Bold** and *Italic*';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should handle blockquotes', () => {
    const html = '<blockquote>Quote line 1<br>Quote line 2</blockquote>';
    const expected = '> Quote line 1\n> Quote line 2';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should handle tables', () => {
    const html = `
      <table>
        <tr><td>A1</td><td>B1</td></tr>
        <tr><td>A2</td><td>B2</td></tr>
      </table>`;
    const expected = 'A1\tB1\nA2\tB2';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should handle multiple newlines and HTML entities', () => {
    const html = '<p>Line&nbsp;1 &amp; test</p><p>Line 2</p>';
    const expected = 'Line 1 & test\n\nLine 2';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should strip unknown tags', () => {
    const html = '<div>Content <span>inside</span></div>';
    const expected = 'Content inside';
    expect(preserveFormat({ html })).toBe(expected);
  });

  it('should ignore headings and paragraphs when listed in ignoreTags', () => {
    const html = '<h1>Heading</h1><p>Paragraph</p>';
    const expected = '<h1>Heading</h1><p>Paragraph</p>';
    expect(preserveFormat({ html, ignoreTags: ['h1', 'p'] })).toBe(expected);
  });

  it('should ignore links when listed in ignoreTags', () => {
    const html = '<a href="https://example.com">Click here</a>';
    const expected = '<a href="https://example.com">Click here</a>';
    expect(preserveFormat({ html, ignoreTags: ['a'] })).toBe(expected);
  });

  it('should ignore blockquotes when listed in ignoreTags', () => {
    const html = '<blockquote>Quote line 1<br>Quote line 2</blockquote>';
    const expected = '<blockquote>Quote line 1\nQuote line 2</blockquote>';
    expect(preserveFormat({ html, ignoreTags: ['blockquote'] })).toBe(expected);
  });

  it('should ignore bold and italic when listed in ignoreTags', () => {
    const html = '<b>Bold</b> and <i>Italic</i>';
    const expected = '<b>Bold</b> and <i>Italic</i>';
    expect(preserveFormat({ html, ignoreTags: ['b', 'i'] })).toBe(expected);
  });

  it('should ignore table rows and cells when listed in ignoreTags', () => {
    const html = `
    <table>
      <tr><td>A1</td><td>B1</td></tr>
      <tr><td>A2</td><td>B2</td></tr>
    </table>`;
    const expected = `<table><tr><td>A1</td><td>B1</td></tr><tr><td>A2</td><td>B2</td></tr></table>`;
    expect(preserveFormat({ html, ignoreTags: ['table', 'tr', 'td'] })).toBe(
      expected
    );
  });

  it('should handle complex nested content', () => {
    const html = `<h1>Main Heading</h1>
    <p>Paragraph with <b>bold</b> and <i>italic</i> text</p>
    <ul><li>Item 1</li><li>Item 2</li></ul>
    <ol><li>First</li><li>Second</li></ol>
    <a href="https://link.com">Link</a>
    <blockquote>Quote line 1<br>Quote line 2</blockquote>
    <table>
      <tr><td>A1</td><td>B1</td></tr>
      <tr><td>A2</td><td>B2</td></tr>
    </table>`;

    const result = preserveFormat({ html });

    const expected = `Main Heading\n\nParagraph with **bold** and *italic* text\n\n- Item 1\n- Item 2\n1. First\n2. Second\n[Link](https://link.com)> Quote line 1\n> Quote line 2A1	B1\nA2	B2`;
    expect(result).toBe(expected);
  });
});

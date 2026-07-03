import { stripNonContent } from './stripNonContent';

describe('stripNonContent', () => {
  test('removes script tags with their content', () => {
    const html = '<script>var a = 1;</script><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('removes style tags with their content', () => {
    const html = '<style>.a{color:red}</style><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('removes head, template and noscript with their content', () => {
    const html =
      '<head><title>Page</title></head><template><li>x</li></template><noscript>Enable JS</noscript><p>Body</p>';
    expect(stripNonContent(html)).toBe('<p>Body</p>');
  });

  test('removes multiple blocks of the same tag', () => {
    const html = '<script>a</script><p>Hi</p><script>b</script>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('handles attributes on the opening tag', () => {
    const html =
      '<script type="text/javascript" defer>var a;</script><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('matches tags case-insensitively', () => {
    const html = '<SCRIPT>var a;</SCRIPT><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('handles multi-line content', () => {
    const html = '<style>\n.a {\n  color: red;\n}\n</style><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('keeps elements listed in ignoreTags', () => {
    const html = '<style>.a{}</style><script>var a;</script>';
    expect(stripNonContent(html, ['style'])).toBe('<style>.a{}</style>');
  });

  test('matches ignoreTags case-insensitively', () => {
    const html = '<style>.a{}</style>';
    expect(stripNonContent(html, ['STYLE'])).toBe('<style>.a{}</style>');
  });

  test('strips an unclosed script to the end of input', () => {
    const html = '<p>Hi</p><script>var a = 1; // truncated email';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('handles whitespace inside the closing tag', () => {
    const html = '<script>var a;</script ><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('handles newlines inside the opening tag', () => {
    const html = '<script\n  type="module">var a;</script><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('matches opening and closing tags with different casing', () => {
    const html = '<script>var a;</SCRIPT><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('removes non-content elements nested inside each other', () => {
    const html = '<noscript><style>.a{}</style></noscript><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('removes empty elements', () => {
    const html = '<script></script><p>Hi</p>';
    expect(stripNonContent(html)).toBe('<p>Hi</p>');
  });

  test('does not match tags that merely start with a non-content name', () => {
    const html = '<style-x>a</style-x><scriptx>b</scriptx>';
    expect(stripNonContent(html)).toBe(html);
  });

  test('returns input unchanged when all tags are ignored', () => {
    const html = '<script>a</script><style>b</style>';
    expect(
      stripNonContent(html, ['script', 'style', 'head', 'template', 'noscript'])
    ).toBe(html);
  });

  test('returns empty string for empty input', () => {
    expect(stripNonContent('')).toBe('');
  });

  test('leaves html without non-content tags untouched', () => {
    const html = '<p>Hello <b>World</b></p>';
    expect(stripNonContent(html)).toBe(html);
  });
});

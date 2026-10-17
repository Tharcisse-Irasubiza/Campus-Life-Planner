export function compileRegex(input, flags = 'i'){
  try {
    return input ? new RegExp(input,flags) : null;
  } catch {
    return null;
  }
}

export function highlight(text, re) {
  if (!text) return '';
  const value = String(text);
  if (!re) return escapeHTML(value);

  let lastIndex = 0;
  const globalRegex = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);
  let highlighted = '';

  for (const match of value.matchAll(globalRegex)) {
    const offset = match.index;
    highlighted += `${escapeHTML(value.slice(lastIndex, offset))}<mark>${escapeHTML(match[0])}</mark>`;
    lastIndex = offset + match[0].length;
  }

  return `${highlighted}${escapeHTML(value.slice(lastIndex))}`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}